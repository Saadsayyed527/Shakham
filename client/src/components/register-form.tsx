"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export function StudentRegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    courses: [] as string[],
  });

  const coursesList = [
    "Medical Diagnosis & Treatment",
    "Biotechnology & Genetic Engineering",
    "Patient Care & Healthcare Management",
    "Financial Analysis & Risk Management",
    "Stock Market Trading & Investment Strategies",
    "Cryptocurrency & Blockchain Finance",
    "Aerodynamics & Flight Mechanics",
    "Avionics & Aircraft Systems",
    "Spacecraft Design & Rocket Propulsion",
    "Contract Law & Legal Documentation",
    "Intellectual Property Rights & Patents",
    "Corporate Governance & Business Law",
    "Full-Stack Web Development",
    "AI & Machine Learning for Beginners",
    "Cybersecurity & Ethical Hacking",
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.username.trim().length < 2) {
      newErrors.username = "Full name must be at least 2 characters";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.courses.length !== 5) {
      newErrors.courses = "You must select exactly 5 courses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (course: string) => {
    if (formData.courses.includes(course)) {
      setFormData({
        ...formData,
        courses: formData.courses.filter((c) => c !== course),
      });
    } else if (formData.courses.length < 5) {
      setFormData({
        ...formData,
        courses: [...formData.courses, course],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      console.log(formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { ...formData, role: "student" });
      setIsLoading(false);
      setError(null);
      if (response.status === 201) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while registering. Please try again.");
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <Input name="username" value={formData.username} onChange={handleChange} placeholder="John Doe" />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <Input name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <label className="block font-medium">Confirm Password</label>
            <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block font-medium">Select 5 Courses</label>
            <div className="grid grid-cols-2 gap-2">
              {coursesList.map((course) => (
                <div key={course}>
                  <input
                    type="checkbox"
                    checked={formData.courses.includes(course)}
                    onChange={() => handleCourseChange(course)}
                    className="mr-2"
                  />
                  {course}
                </div>
              ))}
            </div>
            {errors.courses && <p className="text-red-500 text-sm">{errors.courses}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
          
          
          <div className="mt-4 text-center">
            register as teacher ? <Link to="/register/teacher">Log in</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
