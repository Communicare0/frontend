// src/app/routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import MainLayout from "@/components/layout/MainLayout";

import BoardPage from "@/pages/board/BoardPage";
import ReadPostPage from "@/pages/board/ReadPostPage";

import RestaurantPage from "@/pages/restaurant/RestaurantPage";

import ChatPage from "@/pages/chat/ChatPage";

import MyPage from "@/pages/mypage/MyPage";

import NotificationsPage from "@/pages/notification/NotificationsPage";

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
      { index: true, element: <Navigate to="board/popularity" replace /> },      // "/" -> 홈(게시판)
      { path: "board/:category", element: <BoardPage /> },
      { path: "board/:category/:postId", element: <ReadPostPage /> },
      { path: "restaurant", element: <RestaurantPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
]);
