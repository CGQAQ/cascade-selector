import CascadeSelector from "./cascade-selector";
import "./style";

const MockData = {
  title: "root",
  id: 0,
  children: [
    {
      title: "child1",
      id: 1,
      children: [
        {
          title: "child1.1",
          id: 2,
        },
        {
          title: "child1.2",
          id: 3,
          children: [
            {
              title: "child1.2.1",
              id: 4,
            },
            {
              title: "child1.2.2",
              id: 5,
            },
          ],
        },
      ],
    },
    {
      title: "child2",
      id: 6,
      children: [
        {
          title: "child2.1",
          id: 7,
        },
        {
          title: "child2.2",
          id: 8,
        },
      ],
    },
  ],
};

export default function App() {
  return (
    <div>
      <CascadeSelector data={MockData} />
    </div>
  );
}
