import { QinSoul } from "qin_soul";
import { QinChief } from "./qin-chief";

const chief = new QinChief();
chief.putInDocument();

window.onload = () => {
  QinSoul.head.stopBrowserShortcuts(window);
}