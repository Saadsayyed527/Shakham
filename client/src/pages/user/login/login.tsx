import React from "react";
import { LoginForm } from "@/components/login-form";

const LoginPage: React.FC = () => {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-gray-800 p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Authentication background"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Evolve E-Learning
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Evolve E-Learning has transformed how I teach and connect with my students. The platform's intuitive
              design and powerful features make online education a breeze.&rdquo;
            </p>
            <footer className="text-sm">Dr. Sarah Johnson - Computer Science Professor</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <a href="/register" className="underline underline-offset-4 hover:text-blue-500">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
