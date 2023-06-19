import Header from "./Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "../routes";
import customerRoutes from "../routes/customerRoutes";
import driverRoutes from "../routes/driverRoute";
import { Suspense, lazy } from "react";
import SuspenseContent from "./SuspenseContent";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { useGetUserByIdQuery } from "../app/service/api";

const Page404 = lazy(() => import("../pages/protected/404"));

function PageContent() {
  const { user } = useSelector((state) => state.auth);
  const { data: dataBaseUser } = useGetUserByIdQuery({
    id: user?.uid,
  });

  const mainContentRef = useRef(null);
  const { pageTitle } = useSelector((state) => state.header);

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col ">
      <Header />
      <main
        className="flex-1 overflow-y-auto pt-8 px-6  bg-base-200"
        ref={mainContentRef}
      >
        <Suspense fallback={<SuspenseContent />}>
          <Routes>
            {dataBaseUser?.role === "admin"
              ? routes.map((route, key) => {
                  return (
                    <Route
                      key={key}
                      exact={true}
                      path={`${route.path}`}
                      element={<route.component />}
                    />
                  );
                })
              : dataBaseUser?.role === "customer"
              ? customerRoutes.map((route, key) => {
                  return (
                    <Route
                      key={key}
                      exact={true}
                      path={`${route.path}`}
                      element={<route.component />}
                    />
                  );
                })
              : driverRoutes.map((route, key) => {
                  return (
                    <Route
                      key={key}
                      exact={true}
                      path={`${route.path}`}
                      element={<route.component />}
                    />
                  );
                })}

            {/* Redirecting unknown url to 404 page */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
        <div className="h-16"></div>
      </main>
    </div>
  );
}

export default PageContent;
