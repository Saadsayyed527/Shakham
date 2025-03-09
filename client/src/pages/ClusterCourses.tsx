import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  Cluster: number;
}

const ClusterCourses: React.FC = () => {
  const { clusterId, startIndex = "0" } = useParams<{ clusterId: string; startIndex?: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recommend/${clusterId}/${startIndex}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }
        const data = await response.json();
        setCourses(data.recommended);
        setTotalCourses(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [clusterId, startIndex]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses for Cluster {clusterId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            const newStartIndex = Math.max(parseInt(startIndex) - 5, 0);
            window.location.href = `/cluster/${clusterId}/${newStartIndex}`;
          }}
          disabled={parseInt(startIndex) === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => {
            const newStartIndex = parseInt(startIndex) + 5;
            window.location.href = `/cluster/${clusterId}/${newStartIndex}`;
          }}
          disabled={parseInt(startIndex) + 5 >= totalCourses}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClusterCourses;