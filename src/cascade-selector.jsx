import { useEffect, useState } from "preact/hooks";
import "preact/debug";
import { signal, useSignal } from "@preact/signals";

import "./cascade-selector.css";

const checkedMap = {
  0: { text: "unselected", style: "background: none" },
  1: { text: "partial", style: "background: yellow" },
  2: { text: "selected", style: "background: green" },
};

const updateKey = signal(0);
const forceUpdate = () => {
  updateKey.value += 1;
};

function Layer({ data, all }) {
  const [selected, setSelected] = useState(0);

  return (
    <div class="layer-root">
      <div>
        {data &&
          data.map((item, index) => (
            <div style="display: flex" key={updateKey + index}>
              <div
                class="checkbox"
                style={checkedMap[item.checked].style}
                onClick={() => {
                  onSelcted(item, all);
                  forceUpdate();
                }}
              >
                {checkedMap[item.checked].text}
              </div>
              <div
                class="layer-item"
                style={index === selected ? "background: #bbb" : ""}
                onClick={() => setSelected(index)}
              >
                {item.title}({(item.children && item.children.length) || 0}{" "}
                个子节点)
              </div>
            </div>
          ))}
      </div>

      <div>
        {data && data[selected].children && (
          <Layer data={data[selected].children} all={all} />
        )}
      </div>
    </div>
  );
}

export default function CascadeSelector({ data }) {
  const handledRef = useSignal(handleTree(data));

  return (
    <div>
      <Layer data={[handledRef.value[0].ref]} all={handledRef} />
    </div>
  );
}

function onSelcted(node, all) {
  const propagateUp = (node) => {
    if (node.parent) {
      if (node.parent.children.every((it) => it.checked === 0)) {
        node.parent.checked = 0;
      } else if (node.parent.children.every((it) => it.checked === 2)) {
        node.parent.checked = 2;
      } else {
        node.parent.checked = 1;
      }
      propagateUp(node.parent);
    }
  };

  const propagateDown = (node) => {
    const checked = node.checked;
    const nodePath = node.meta.path;

    all.value
      .filter((it) => it.path.startsWith(nodePath))
      .forEach((it) => {
        if (checked !== 1) it.ref.checked = checked;
      });
  };

  node.checked = node.checked === 2 ? 0 : 2;
  if (isLeaf(node, all)) {
    propagateUp(node);
  } else {
    propagateDown(node);
    propagateUp(node);
  }
}

function handleTree(data) {
  const result = [];
  const join = (prefix, current) => {
    if (prefix.length === 0) {
      return "" + current;
    } else {
      return prefix + "-" + current;
    }
  };
  const traverse = (node, path = "") => {
    node.checked = 0; /* 0: unselected, 1: partial selected(for non leaf), 2: selected */
    const meta = { ref: node, path: join(path, node.id) };
    node.meta = meta;

    result.push(meta);
    if (node.children) {
      node.children.forEach((child) => {
        child.parent = node;
        traverse(child, join(path, node.id));
      });
    }
  };

  traverse(data);
  return result;
}

function isLeaf(node) {
  !node.children;
}
