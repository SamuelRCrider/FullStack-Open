import Course from "./Course/component";

const Courses = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        return <Course key={course.id} course={course} />;
      })}
    </div>
  );
};

export default Courses;
