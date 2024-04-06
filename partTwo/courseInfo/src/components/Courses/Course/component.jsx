import Header from "./Header/component";
import Content from "./Content/component";

const Course = ({ course }) => {
  return (
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

export default Course;
