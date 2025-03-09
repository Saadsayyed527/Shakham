import { useEffect, useState } from "react";

interface Course {
  course_id: number;
  course_title: string;
  url: string;
  price: number;
  num_subscribers: number;
  num_reviews: number;
  num_lectures: number;
  level: string;
  content_duration: number;
  subject: string;
}

const CourseRecommendations = ({ userId, courseId }: { userId: number; courseId: number }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Use dynamic userId and courseId
        const response = await fetch(`http://localhost:5000/recommend/${userId}/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        
        console.log("Fetched Data:", data.recommended.slice(0, 5)); // Log data to verify
        setCourses(data.recommended.slice(0, 5)); // Set state
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId, courseId]); // Re-fetch when userId or courseId changes

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <div key={course.course_id} className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-bold mt-2">{course.course_title}</h3>
          <p className="text-gray-600 text-sm">{course.subject} - {course.level}</p>
          <p className="text-blue-500 text-sm">Duration: {course.content_duration} hrs</p>
          <p className="text-green-500 text-sm font-semibold">Price: ${course.price}</p>
          <p className="text-gray-700 text-sm">Subscribers: {course.num_subscribers}</p>
          <p className="text-gray-700 text-sm">Reviews: {course.num_reviews}</p>
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Course
          </a>
        </div>
      ))}
    </div>
  );
};

export default CourseRecommendations;