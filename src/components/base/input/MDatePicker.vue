<template>
  <div class="datepicker-wrapper">
    <div class="datepicker-input-wrapper">
      <input
        :class="['datepicker-input', { 'm-input--error': isInvalidDate }]"
        type="text"
        placeholder="DD/MM/YYYY"
        :tabindex="tabindex"
        v-model="currentFullDate"
        ref="refInput"
        @keydown="handleKeyDown"
        @blur="handleBlur"
      />
      <div v-if="isInvalidDate" class="input--error-message">
        {{ errorMessage }}
      </div>
      <div
        class="icon-wrapper"
        @click="isShowCalender = !isShowCalender"
        ref="refButton"
      >
        <div class="icon icon-24 icon-datepicker"></div>
      </div>
    </div>
    <div class="datepicker" v-if="isShowCalender" ref="refCalender">
      <div class="calendar-header">
        <div class="calender-current-date">
          Tháng {{ dateHeader.month }}, {{ dateHeader.year }}
        </div>
        <div class="icons-wrapper">
          <div class="icon-wrapper">
            <div
              class="icon icon-16 icon-chevron-left"
              @click="updateNewMonth(dateHeader.month - 1)"
            ></div>
          </div>
          <div class="icon-wrapper">
            <div
              class="icon icon-16 icon-chevron-right"
              @click="updateNewMonth(dateHeader.month + 1)"
            ></div>
          </div>
        </div>
      </div>
      <div class="calendar-body">
        <table class="calendar-table">
          <thead>
            <tr>
              <td class="date">T2</td>
              <td class="date">T3</td>
              <td class="date">T4</td>
              <td class="date">T5</td>
              <td class="date">T6</td>
              <td class="date">T7</td>
              <td class="date">CN</td>
            </tr>
          </thead>
          <tbody class="date-in-month">
            <tr v-for="row in dayInMonth" :key="row">
              <td
                v-for="column in row"
                @click="onClickDate(column)"
                :class="[
                  'date',
                  {
                    'date-day-seleted':
                      column == currentDate.date &&
                      dateHeader.month == currentDate.month,
                  },
                ]"
                :key="column"
              >
                {{ column }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="calendar-footer">
        <button class="pick-today-button" @click="handleGetCurrentDate">
          Hôm nay
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  ref,
  computed,
  onUnmounted,
  onBeforeMount,
  toRefs,
  onMounted,
  watch,
} from "vue";
import { useStore } from "vuex";
import { INVALID_DATE } from "@/utils/resource/date-picker";
const keyCodeEnum = {
  BACKSPACE: 8,
  NUMBER_0: 48,
  NUMBER_9: 57,
};

export default {
  props: {
    tabindex: Number,
    modelValue: String,
    maxDate: Date,
  },
  setup(props, context) {
    const { modelValue, maxDate } = toRefs(props);
    const refCalender = ref(null);
    const refButton = ref(null);
    const isShowCalender = ref(false);
    const refInput = ref(null);
    const dateHeader = ref({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    const currentFullDate = ref();
    const currentDate = ref({
      date: Number,
      month: Number,
      year: Number,
    });
    const dayInMonth = ref([]);
    const { state } = useStore();
    const isInvalidDate = ref(false);
    const errorMessage = ref("");
    if (state.language) {
      errorMessage.value = INVALID_DATE[state.language];
    } else {
      errorMessage.value = INVALID_DATE.VI;
    }
    /******************************
     * Xử lý bấm chuột
     * NXTSAN 03-10-2022
     */
    const handleMouseDown = (event) => {
      if (!refCalender.value) return;
      if (
        refCalender.value &&
        !refCalender.value.contains(event.target) &&
        refButton.value &&
        !refButton.value.contains(event.target)
      ) {
        isShowCalender.value = false;
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    onBeforeMount(() => {
      if (modelValue.value) {
        var date = new Date(modelValue.value);
        dateHeader.value.month = date.getMonth() + 1;
        dateHeader.value.year = date.getFullYear();
        onClickDate(date.getDate());
      } else {
        handleGetCurrentDate();
      }
    });

    onUnmounted(() => {
      document.removeEventListener("mousedown", handleMouseDown);
    });

    getDaysInMonth();

    /******************************
     * Lấy bảng các ngày trong 1 tháng
     * NXTSAN 03-10-2022
     */
    function getDaysInMonth() {
      dayInMonth.value = [];
      const totalDate = new Date(
        dateHeader.value.year,
        dateHeader.value.month,
        0
      ).getDate();
      var date = 1;
      var column = 0;
      var day = new Date(
        dateHeader.value.year,
        dateHeader.value.month - 1,
        date
      ).getDay();
      if (day == 0) {
        column = 7;
      } else {
        column = day - 1;
      }
      var dateInRows = [];
      for (let i = 0; i < column; i++) {
        dateInRows.push("");
      }
      while (date <= totalDate) {
        dateInRows.push(date);
        date++;
        column++;
        if (column == 7 || date == totalDate + 1) {
          dayInMonth.value.push(dateInRows);
          column = 0;
          dateInRows = [];
        }
      }
    }

    /******************************
     * Xử lý khi thay đổi tháng
     * NXTSAN 03-10-2022
     */
    const updateNewMonth = (dateHeaderMonth) => {
      if (dateHeaderMonth < 1) {
        dateHeader.value.month = 12;
        dateHeader.value.year -= 1;
        return;
      } else if (dateHeaderMonth > 12) {
        dateHeader.value.month = 1;
        dateHeader.value.year += 1;
      } else {
        dateHeader.value.month = dateHeaderMonth;
      }
      getDaysInMonth();
    };

    /******************************
     * Xử lý chọn ngày
     * NXTSAN 03-10-2022
     */
    const onClickDate = (date) => {
      if (maxDate.value) {
        if (
          !isLessThanMaxDate(
            {
              date: date,
              month: dateHeader.value.month,
              year: dateHeader.value.year,
            },
            maxDate.value
          )
        ) {
          return;
        }
      }
      currentDate.value.date = date;
      currentDate.value.month = dateHeader.value.month;
      currentDate.value.year = dateHeader.value.year;
      if (date < 10) date = `0${+date}`;
      if (currentDate.value.month < 10) {
        dateHeader.value.month = `0${+dateHeader.value.month}`;
      }
      currentFullDate.value = `${date}/${dateHeader.value.month}/${dateHeader.value.year}`;
      updateNewDate(date, dateHeader.value.month, dateHeader.value.year);
      isShowCalender.value = false;
      // refInput.value.focus();
    };

    /******************************
     * Cập nhật lại ngày
     * NXTSAN 03-10-2022
     */
    const updateNewDate = (date, month, year) => {
      context.emit("update:modelValue", `${year}-${month}-${date}`);
    };

    /******************************
     * Xử lý nhập phím
     * NXTSAN 03-10-2022
     */
    const handleKeyDown = (event) => {
      var value = event.target.value;
      if (value == "") {
        currentFullDate.value = "__/__/____";
      }
      var keyCode = event.keyCode;
      if (keyCode == keyCodeEnum.BACKSPACE) {
        currentFullDate.value = removeLastCharBy(currentFullDate.value, "_");
      } else if (
        keyCode >= keyCodeEnum.NUMBER_0 &&
        keyCode <= keyCodeEnum.NUMBER_9
      ) {
        var isValidDate = true;
        isInvalidDate.value = false;
        var character = String.fromCharCode(event.which);
        var tempDateTime = currentFullDate.value.replace("_", character);
        const dateArray = tempDateTime.split("/");
        var tempDate = dateArray[0];
        var tempMonth = dateArray[1];
        var tempYear = dateArray[2];

        if (maxDate.value && tempYear[3] != "_") {
          if (
            !isLessThanMaxDate(
              { date: +tempDate, month: +tempMonth, year: +tempYear },
              maxDate.value
            )
          )
            isValidDate = false;
        }

        if (!isValidDateInput(tempDate)) {
          isValidDate = false;
        }
        if (!isValidMonthInput(tempMonth)) {
          isValidDate = false;
        }

        if (isValidDate) {
          currentFullDate.value = tempDateTime;
          var dateParts = currentFullDate.value.split("/");
          updateNewDate(dateParts[0], dateParts[1], dateParts[2]);
        } else {
          isInvalidDate.value = true;
        }
      } else if (keyCode == 9) {
        return;
      }
      event.preventDefault();
    };

    const isValidDateInput = (date) => {
      if (/^([1-2_][0-9_])|([0_][1-9_])|([3_][0-1_])$/.test(date) == false) {
        return false;
      }
      return true;
    };

    const isValidMonthInput = (month) => {
      if (/^([0_][0-9_])|([1_][0-2_])$/.test(month) == false) {
        return false;
      }
      return true;
    };

    const removeLastCharBy = (string, char) => {
      return string.replace(new RegExp("[0-9]([^0-9]*)$"), char + "$1");
    };

    const isLessThanMaxDate = (currentDate, maxDate) => {
      var _maxDate = maxDate.getDate();
      var _maxMonth = maxDate.getMonth() + 1;
      var _maxYear = maxDate.getFullYear();
      if (currentDate.year < _maxYear) {
        return true;
      } else if (
        currentDate.year == _maxYear &&
        currentDate.month < _maxMonth
      ) {
        return true;
      } else if (
        currentDate.year == _maxYear &&
        currentDate.month == _maxMonth &&
        currentDate.date <= _maxDate
      ) {
        return true;
      }
      return false;
    };

    /******************************
     * Lấy ngày hiện tại
     * NXTSAN 03-10-2022
     */
    const handleGetCurrentDate = () => {
      var today = new Date();
      dateHeader.value.month = today.getMonth() + 1;
      updateNewMonth(dateHeader.value.month);
      dateHeader.value.year = today.getFullYear();
      onClickDate(today.getDate());
    };

    // handleGetCurrentDate();

    /******************************
     * Xử lý khi rời khỏi input
     * NXTSAN 03-10-2022
     */
    const handleBlur = () => {
      if (currentFullDate.value.includes("_")) {
        var date = modelValue.value ? new Date(modelValue.value) : new Date();
        dateHeader.value.month = date.getMonth() + 1;
        dateHeader.value.year = date.getFullYear();
        onClickDate(date.getDate());
        isInvalidDate.value = false;
      }
    };

    return {
      refInput,
      isInvalidDate,
      errorMessage,
      handleBlur,
      refCalender,
      refButton,
      isShowCalender,
      currentFullDate,
      currentDate,
      dateHeader,
      dayInMonth,
      updateNewMonth,
      onClickDate,
      handleKeyDown,
      handleGetCurrentDate,
    };
  },
};
</script>

<style>
.datepicker-wrapper {
  position: relative;
}

.datepicker-input-wrapper {
  display: flex;
  position: relative;
}

.datepicker-input {
  min-width: 150px;
  width: 100%;
  height: 36px;
  padding: 0px 12px;
  border-radius: 4px 0 0 4px;
  background-color: var(--input__background--normal);
  border: 1px solid var(--input__border--normal);
  border-right: none;
}

.datepicker-input:hover {
  background-color: var(--input__background--hover);
  border: 1px solid var(--input__border--hover);
}

.datepicker-input:focus {
  background-color: var(--input__background--focus);
  border-top: 1px solid var(--input__border--focus);
  border-bottom: 1px solid var(--input__border--focus);
  border-left: 1px solid var(--input__border--focus);
}

.datepicker-input:focus ~ .icon-wrapper {
  background-color: var(--input__background--focus);
  border-top: 1px solid var(--input__border--focus);
  border-bottom: 1px solid var(--input__border--focus);
  border-right: 1px solid var(--input__border--focus);
}

.datepicker-input-wrapper .icon-wrapper {
  min-width: 40px;
  height: 36px;
  border-radius: 0 4px 4px 0;
  border: 1px solid #e6e6e6;
  border-left: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.datepicker-input-wrapper .icon-wrapper:hover {
  background-color: #d6d6d6;
  cursor: pointer;
}

.datepicker {
  position: absolute;
  left: 0;
  z-index: 109;
  background: #fff;
  width: 320px;
  overflow: hidden;
  padding: 0 24px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.051);
}

.calendar-header {
  margin-top: 28px;
  margin-bottom: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-header .icons-wrapper {
  display: flex;
  gap: 8px;
}

.calendar-header .icons-wrapper .icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.calendar-header .calender-current-date {
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
}

.calendar-body {
  padding: 0;
}

.calendar-body td {
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
}

.calendar-body tr {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
}

.calendar-body .calendar-table {
  width: 100%;
}
.calendar-body .calendar-table .date-in-month {
  text-align: center;
}

.date {
  font-weight: 400;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
}
/* .calendar-table thead tr th,
td {
  width: 32px;
  height: 32px;
} */

.date-day-seleted {
  color: #fff;
  font-weight: 600;
  background-color: #50b83c;
}
.calendar-footer {
  text-align: center;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #babec5;
}

.calendar-footer .pick-today-button {
  border: none;
  background: #fff;
  color: #50b83c;
  font-size: 13px;
  cursor: pointer;
}

.input--error-message {
  display: none;
  color: var(--input__border--error);
  position: absolute;
  /* transform: translate(0, 4px); */
  top: 100%;
  font-size: 12px;
  width: 100%;
  z-index: 3;
  left: 50%;
  transform: translate(-50%, 8px);
  background: #f77;
  color: #fff;
  box-shadow: 2px 2px 2px 0 #d4d7dc;
  border-radius: 4px;
  padding: 4px 8px;
  max-width: 500px;
}

.input--error-message::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #f77;
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translate(-50%, 0);
}

.m-input--error {
  background-color: var(--input__background--error) !important;
  border-top: 1px solid var(--input__border--error) !important;
  border-left: 1px solid var(--input__border--error) !important;
  border-bottom: 1px solid var(--input__border--error) !important;
}

.m-input--error ~ .icon-wrapper {
  background-color: var(--input__background--error) !important;
  border-top: 1px solid var(--input__border--error) !important;
  border-right: 1px solid var(--input__border--error) !important;
  border-bottom: 1px solid var(--input__border--error) !important;
}

.m-input--error:hover + .input--error-message {
  display: block;
}
</style>
