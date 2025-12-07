// src/app/routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
//로그인, 회원가입
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
//메인화면(네비게이션 바)
import MainLayout from "@/components/layout/MainLayout";
//게시판 관련
import BoardPage from "@/pages/board/BoardPage";
import ReadPostPage from "@/pages/board/ReadPostPage";
import WritePostPage from "@/pages/board/WritePostPage";
import MyBoardPage from "@/pages/board/MyBoardPage";
//식당 관련
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
//채팅 관련
import ChatPage from "@/pages/chat/ChatPage";
//마이페이지 관련
import MyPage from "@/pages/mypage/MyPage";
import UpdateUserInfoPage from "@/pages/mypage/UpdateUserInfoPage";
import SetKeywordPage from "@/pages/mypage/SetKeywordPage";
//공지페이지 관련
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
      { index: true, element: <Navigate to="board/university" replace /> },      // "/" -> 홈(게시판)
      { path: "board", element: <Navigate to="university" replace />},
      { path: "board/:category", element: <BoardPage /> },
      { path: "board/:category/:postId", element: <ReadPostPage /> },
      { path: "board/:category/write", element: <WritePostPage /> },
      { path: "board/myboard", element: <MyBoardPage />},
      { path: "restaurant", element: <RestaurantPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "mypage/updateUserInfo", element: <UpdateUserInfoPage />},
      { path: "mypage/keyword", element: <SetKeywordPage />},
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
]);
