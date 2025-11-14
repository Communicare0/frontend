// src/app/routes.jsx
import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/home/HomePage";
import AjouBoardPage from "@/pages/board/AjouBoardPage";
import RestaurantBoardPage from "@/pages/board/RestaurantBoardPage";
import FreeBoardPage from "@/pages/board/FreeBoardPage";
import MapPage from "@/pages/map/MapPage";
import ChatPage from "@/pages/chat/ChatPage";
import MyPage from "@/pages/mypage/MyPage";

import RequireAuth from "@/components/auth/RequireAuth";
import PublicOnlyRoute from "@/components/auth/PubilcOnlyRoute";

export const router = createBrowserRouter([
  // 로그인/회원가입
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },

  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },

  // 로그인 이후 메인 레이아웃
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },      // "/" -> 홈(게시판)
      { path: "home", element: <HomePage /> },     // "/home"도 동일
      { path: "boards/ajou", element: <AjouBoardPage /> },
      { path: "boards/restaurant", element: <RestaurantBoardPage /> },
      { path: "boards/free", element: <FreeBoardPage /> },
      { path: "map", element: <MapPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
]);
