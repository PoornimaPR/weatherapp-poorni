import { cityNames } from "./data.js";
import { topDisplay } from "./top.js";
import { middleDisplay } from "./middle.js";
import { bottomDisplay } from "./bottom.js";

//Anonymous function to start the js files
(function () {
  //top container
  topDisplay();
  //middle container
  middleDisplay(cityNames);
  //bottom container
  bottomDisplay(cityNames);
})();
