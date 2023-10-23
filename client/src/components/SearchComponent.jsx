import React, { useState } from 'react';
import Book from "./Book";
import "../App.scss";

const ComponentList = ({ components }) => {
    console.log("ComponentList", components);
  return (
    <ul className="d-flex mt-1"
    style={{
      flexWrap: "wrap",
      gap: 30,
    }}>
      {components.map((component) => (
        <Book key={component._id} book={component} />
      ))}
    </ul>
  );
};

const SearchComponent = ({ components }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredComponents, setFilteredComponents] = useState(components);

  const componentArray = [];

  for (const key in components) {
    if (components.hasOwnProperty(key)) {
      const currentItem = components[key];
      componentArray.push({ key, ...currentItem });
    }
  }


  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    console.log(query);
    console.log(componentArray);

    const filtered = componentArray.filter((component) =>
      component.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredComponents(filtered);
  };

  return (
    <div className='form-group'>
      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={handleSearch}
      />
      <ComponentList components={filteredComponents} />
    </div>
  );
};

export default SearchComponent;
