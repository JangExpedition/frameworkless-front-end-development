import filtersView from "./filters.js";

let targetElement;
const TEMPLATE = `<ul class="filters">
    <li>
        <a href="#/">All</a>
    </li>
    <li>
        <a href="#/active">Active</a>
    </li>
    <li>
        <a href="#/completed">Completed</a>
    </li>
</ul>`;

describe("filtersView", () => {
  beforeEach(() => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = TEMPLATE;
    targetElement = tempElement.childNodes[0];
  });

  test("shold add the class 'selected' to the anchor with the same text of the currentFilter", () => {
    const newFilters = filtersView(targetElement, {
      currentFilter: "Active",
    });

    const selectedItem = newFilters.querySelector("li a.selected");

    expect(selectedItem.textContent).toBe("Active");
  });
});
