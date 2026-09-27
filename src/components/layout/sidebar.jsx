import React from "react";

export const Sidebar = () => {
  return (
    <aside className="lateral">
      <div className="search">
        <h3 className="title">Buscar</h3>
        <form>
          <input type="text" placeholder="Buscar..." />
          <button id="search" type="submit" value="Buscar">
            Buscar
          </button>
        </form>
      </div>
      {/*<div className="add">
        <h3 className="title">Agregar</h3>
        <form>
          <input type="text" placeholder="Título..." />
          <textarea id="description" placeholder="Contenido..." />
          <input type="submit" id="save" value="Agregar" />
        </form>
      </div>*/}
    </aside>
  );
};
