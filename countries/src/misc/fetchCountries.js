import { alert, error, defaultModules } from "@pnotify/core/dist/PNotify";
import * as PNotifyMobile from "@pnotify/mobile/dist/PNotifyMobile";
import debounce from "lodash.debounce";
import "../../node_modules/@pnotify/core/dist/PNotify.css";
import "../../node_modules/@pnotify/core/dist/BrightTheme.css";
import cards from "../misc/cards.hbs";

defaultModules.set(PNotifyMobile, {});

let name, notice;
const url = `https://restcountries.eu/rest/v2/name/`;
const input = document.getElementById("get-country");
const button = document.getElementById("get-country-btn");
const div = document.getElementById("country-box");

input.addEventListener(
  "input",
  debounce(() => {
    name = input.value;
    div.innerHTML = "";

    fetch(`${url}${name}`)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (!name) {
          div.innerHTML = "";
        } else {
          notice = alert({ title: "Not found", hide: true, delay: 1000 });
        }
        if (response.status == 404) {
          error({ text: "error 404" });
        }
      })
      .then((data) => {
        if (data.length > 10) return error({ text: "Введите более точный запрос страны" });
        if (!data.length) return error({ text: "Пустой запрос" });

        const country = cards(data);
        div.insertAdjacentHTML("afterbegin", country);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, 400)
);