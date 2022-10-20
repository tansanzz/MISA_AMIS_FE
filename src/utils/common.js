import GenderEnum from "./enum/gender";
const common = {
  /*****************
   * Định dạng lại ngày tháng năm
   * Author: SAN (12/09/2022)
   */
  formatDate(date, format) {
    try {
      if (date) {
        date = new Date(date);
        // Lấy ra ngày
        let day = date.getDate();
        day = day < 10 ? `0${day}` : day;
        // Lấy ra tháng
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        // Lấy ra năm
        let year = date.getFullYear();
        if (format == "dd/MM/YYYY") return `${day}/${month}/${year}`;
        if (format == "YYYY-MM-dd") return `${year}-${month}-${day}`;
        return `${year}-${month}-${day}`;
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
    }
  },
  /*****************************
   * Định dạng tiền VND
   * Author: SAN (12/09/2022)
   * @param {Number} Tiền
   */
  formatMoneyVND(money) {
    try {
      money = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(money);
      return money;
    } catch (error) {
      console.log(error);
      return "";
    }
  },
  /***********************************
   * Format thong tin khong null
   * Author: SAN (12/09/2022)
   * @param {String}
   */
  formatNotNull(value) {
    try {
      if (value == "" || value == null) return false;
      return true;
    } catch (error) {
      console.log(error);
    }
  },
  /***********************************
   * Format thong tin giới tính
   * Author: SAN (12/09/2022)
   * @param {String}
   */
  formatGender(value) {
    try {
      for (const gender in GenderEnum) {
        if (value == GenderEnum[gender].number) {
          return GenderEnum[gender].label;
        }
      }
      return "";
    } catch (error) {
      console.log(error);
    }
  },
};
const formatDate = common.formatDate
const formatGender = common.formatGender

export default common;
export { formatDate, formatGender }