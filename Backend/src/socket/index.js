const { createClient } = require("redis");

const redisClient = createClient(6379);
let currentTimerId = null;
let totalCustomers = null;
let totalDrivers = null;
let availableDrivers = [];

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  redisClient.on("error", (error) => {
    console.error("Redis connection error", error);
  });

  redisClient.connect().then(() => {
    console.log("Redis is connected successfully");
  });

  io.on("connection", async (socket) => {
    socket.on("add-driver", async ({ phoneNumber, online, name }) => {
      const driver = {
        phoneNumber,
        online,
        name,
        socketId: socket.id,
      };
      await redisClient.hSet(
        "onlineDrivers",
        phoneNumber,
        JSON.stringify(driver)
      );
      totalDrivers = await redisClient.hGetAll("onlineDrivers");

      if (Object.values(totalDrivers).length > 0) {
        availableDrivers = Object.values(totalDrivers)
          .map((driverStr) => {
            const driverObj = JSON.parse(driverStr);
            if (driverObj.online === true) {
              return driverObj;
            }
          })
          .filter(Boolean);
      }
      console.log("Total Drivers Available", totalDrivers);
    });

    socket.on("add-customer", async ({ phoneNumber, name }) => {
      await redisClient.hSet(
        "onlineCustomers",
        phoneNumber,
        JSON.stringify({ name, socketId: socket.id })
      );
      totalCustomers = await redisClient.hGetAll("onlineCustomers");
      console.log("Total Customers", totalCustomers);
    });

    socket.on(
      "customer-ride-request",
      async ({ currentAddress, rideInformation, user }) => {
        const stringifiedCustomer = await redisClient.hGet(
          "onlineCustomers",
          user.phoneNumber
        );
        const customer = JSON.parse(stringifiedCustomer);
        console.log(
          "Request ride received from customer:",
          customer,
          availableDrivers
        );

        if (availableDrivers.length > 0) {
          const selectedDriver = availableDrivers.shift();
          console.log("Selected driver:", selectedDriver);

          // Emit ride request to the selected driver
          io.to(selectedDriver.socketId).emit("driver-ride-request", {
            rideInformation,
            currentAddress,
            customer: user,
          });

          const timerDuration = 15; // in seconds

          const startTimer = (driver) => {
            let remainingTime = timerDuration;

            currentTimerId = setInterval(() => {
              remainingTime--;
              console.log(remainingTime);

              if (remainingTime === 0) {
                clearInterval(currentTimerId);

                if (availableDrivers.length > 0) {
                  const nextDriver = availableDrivers.shift();
                  console.log("Next driver:", nextDriver);
                  if (nextDriver) {
                    // Emit ride request to the next driver
                    io.to(nextDriver.socketId).emit("driver-ride-request", {
                      rideInformation,
                      currentAddress,
                      customer: user,
                    });

                    startTimer(nextDriver);
                  } else {
                    // No available drivers, send response to the customer
                    io.to(customer.socketId).emit("no-ride-found", {
                      message:
                        "Sorry, currently there are no drivers available. Please try later",
                    });
                  }
                } else {
                  // No available drivers, send response to the customer
                  io.to(customer.socketId).emit("no-ride-found", {
                    message:
                      "Sorry, currently there are no drivers available. Please try later",
                  });
                }
              }

              io.to(driver.socketId).emit("timer-update", {
                time: remainingTime,
              });
            }, 1000); // run every second
          };

          startTimer(selectedDriver);
        } else {
          // No available drivers, send response to the customer
          io.to(customer.socketId).emit("ride-response", {
            message: "No drivers available",
          });
        }
      }
    );

    socket.on(
      "ride-accepted",
      async ({ customer: customerData, driver: driverObj }) => {
        const stringifiedCustomer = await redisClient.hGet(
          "onlineCustomers",
          customerData.customer.phoneNumber
        );
        const stringifiedDriver = await redisClient.hGet(
          "onlineDrivers",
          driverObj.phoneNumber
        );

        const customer = JSON.parse(stringifiedCustomer);
        const driver = JSON.parse(stringifiedDriver);

        if (currentTimerId) {
          clearInterval(currentTimerId);
          currentTimerId = null;
        }

        // // Send response to the customer that the ride is accepted
        io.to(customer.socketId).emit("driver-assign", {
          customer: customerData,
          driver: driverObj,
        });
        io.to(driver.socketId).emit("driver-assign", {
          customer: customerData,
          driver: driverObj,
        });
      }
    );

    // socket.on("disconnect", () => {
    //   // Remove driver from available drivers list
    //   if (availableDrivers.length < 0) return;
    //   const disconnectedDriver = availableDrivers.find(
    //     (driver) => driver.socketId === socket.id
    //   );
    //   if (disconnectedDriver) {
    //     availableDrivers = availableDrivers.filter(
    //       (driver) => driver.socketId !== socket.id
    //     );
    //     console.log("Driver disconnected:", disconnectedDriver);
    //   }
    // });
  });
};
