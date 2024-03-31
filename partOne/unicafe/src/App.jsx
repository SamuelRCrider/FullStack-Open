import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.review}</button>;
};

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>
        {props.text} {props.stat} {props.percentage}
      </td>
    </tr>
  );
};

const Statistics = (props) => {
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" stat={props.good} />
          <StatisticsLine text="neutral" stat={props.neutral} />
          <StatisticsLine text="bad" stat={props.bad} />
          <StatisticsLine text="total" stat={props.total} />
          <StatisticsLine text="average" stat={props.average / props.total} />
          <StatisticsLine
            text="positive"
            stat={(props.good / props.total) * 100}
            percentage="%"
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);

  const values = {
    good: 1,
    neutral: 0,
    bad: -1,
  };

  const handleGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
    setAverage(average + values.good);
  };
  const handleNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
    setAverage(average + values.neutral);
  };
  const handleBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
    setAverage(average + values.bad);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} review="good" />
      <Button onClick={handleNeutral} review="neutral" />
      <Button onClick={handleBad} review="bad" />
      {!total ? (
        <p>No Feedback Given</p>
      ) : (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={average}
        />
      )}
    </div>
  );
};

export default App;
