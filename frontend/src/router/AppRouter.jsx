import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const AppRoute = () => {
  return (
    <div>
      <Header />
      {/* pt-20 클래스를 추가하여 fixed 헤더 높이만큼 컨텐츠를 아래로 내립니다. */}
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppRoute;
