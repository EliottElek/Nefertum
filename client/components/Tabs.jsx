import React, { useState } from "react";

export default function Tabs({ children }) {
  function findActiveTab(a) {
    return a.reduce((accumulator, currentValue, i) => {
      if (currentValue.props.active) {
        return i;
      }

      return accumulator;
    }, 0);
  }

  function tabValidator(tab) {
    return tab.type.displayName === "Tab" ? true : false;
  }

  const [activeTab, setActiveTab] = useState(findActiveTab(children));
  return (
    <div className="bg-gray-100 rounded border">
      <div className="flex justify-start">
        {children.map((item, i) => {
          return (
            <>
              {tabValidator(item) && (
                <Tab
                  title={item.props.title}
                  key={`tab-{i}`}
                  currentTab={i}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {item.props.children}
                </Tab>
              )}
            </>
          );
        })}
      </div>
      <div className="p-5 border-t">
        {children.map((item, i) => {
          return (
            <div className={` ${i === activeTab ? "visible" : "hidden"}`}>
              {item.props.children}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Tab({ title, activeTab, currentTab, setActiveTab }) {
  return (
    <>
      <div
        className={`px-2 py-1 rounded-t cursor-pointer 
      ${activeTab === currentTab ? "bg-white" : "bg-gray-100"}`}
        onClick={() => setActiveTab(currentTab)}
      >
        {title}
      </div>
    </>
  );
}

Tab.displayName = "Tab";
