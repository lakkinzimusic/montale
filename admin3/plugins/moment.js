import moment from "moment";
export default async (context, inject) => {
  moment.locale('ru');
  inject('moment', moment);
}
