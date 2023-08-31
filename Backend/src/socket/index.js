const { createClient } = require("redis");
const { v4: uuidv4 } = require("uuid");

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
    socket.on("add-driver", async ({ phoneNumber, online, name, location }) => {
      const driver = {
        phoneNumber,
        online,
        name,
        socketId: socket.id,
        location,
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
      if (totalCustomers && Object.values(totalCustomers).length > 0) {
        Object.values(totalCustomers).forEach((customer) => {
          const { socketId } = JSON.parse(customer);
          io.to(socketId).emit("online-drivers", availableDrivers);
        });
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
        const rideId = uuidv4();
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

          io.to(selectedDriver.socketId).emit("driver-ride-request", {
            rideInformation,
            currentAddress,
            customer: user,
            rideId,
          });

          const timerDuration = 15;

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
                    io.to(nextDriver.socketId).emit("driver-ride-request", {
                      rideInformation,
                      currentAddress,
                      customer: user,
                      rideId,
                    });

                    startTimer(nextDriver);
                  } else {
                    io.to(customer.socketId).emit("no-ride-found", {
                      message:
                        "Sorry, currently there are no drivers available. Please try later",
                    });
                  }
                } else {
                  io.to(customer.socketId).emit("no-ride-found", {
                    message:
                      "Sorry, currently there are no drivers available. Please try later",
                  });
                }
              }

              io.to(driver.socketId).emit("timer-update", {
                time: remainingTime,
              });
            }, 1000);
          };

          startTimer(selectedDriver);
        } else {
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

    socket.on("ride-started", async ({ customerInfo, driver: driverObj }) => {
      const stringifiedCustomer = await redisClient.hGet(
        "onlineCustomers",
        customerInfo.customer.phoneNumber
      );

      const customer = JSON.parse(stringifiedCustomer);

      io.to(customer.socketId).emit("ride-start", {
        customerInfo,
        driver: driverObj,
      });
    });
    socket.on("ride-ended", async ({ customerInfo, driver: driverObj }) => {
      const stringifiedCustomer = await redisClient.hGet(
        "onlineCustomers",
        customerInfo.customer.phoneNumber
      );

      const customer = JSON.parse(stringifiedCustomer);

      io.to(customer.socketId).emit("ride-end", {
        customerInfo,
        driver: driverObj,
      });
    });
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
