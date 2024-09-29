<!-- <template>
  <div class="datepicker">
    <h3>Available Date</h3>
    <div class="calendar">
      <div class="header">
        <button @click="prevMonth" class="nav-button">&lt;</button>
        <h4>{{ monthNames[currentMonth] }} {{ currentYear }}</h4>
        <button @click="nextMonth" class="nav-button">&gt;</button>
      </div>
      <div class="days-of-week">
        <div v-for="day in daysOfWeek" :key="day" class="day-header">
          {{ day }}
        </div>
      </div>
      <div class="days-grid">
        <div
          v-for="(day, index) in daysInMonth"
          :key="index"
          class="day"
          :class="{
            selected: isSelected(day),
            disabled: isDisabled(day).isDisabled && !isDisabled(day).isLocked,
            locked: isDisabled(day).isLocked,
            unlocking: isUnlocking(day),
          }"
          @click="toggleDate(day)"
          :disabled="isDisabled(day)"
        >
          {{ day }}
        </div>
      </div>
    </div>
    <div class="button-container">
      <button @click="checkIn" class="checkin-button">Check In</button>
      <button @click="checkOut" class="checkout-button">Check Out</button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["select-dates"]);

const props = defineProps({
  lockedDates: {
    type: Array,
    default: () => [],
  },
  homestayId: {
    type: Number,
    required: true,
  },
});

const currentDate = ref(new Date());
const checkInDate = ref(null);
const checkOutDate = ref(null);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const daysInMonth = computed(() => {
  const start = new Date(currentYear.value, currentMonth.value, 1);
  const end = new Date(currentYear.value, currentMonth.value + 1, 0);
  const days = [];

  // Add leading empty days
  for (let i = 0; i < start.getDay(); i++) {
    days.push("");
  }

  // Add actual days of the month
  for (let i = 1; i <= end.getDate(); i++) {
    days.push(i);
  }

  return days;
});

const isDisabled = (day) => {
  if (!day) return true;

  const dateToCheck = new Date(currentYear.value, currentMonth.value, day);
  const dateString = `${currentYear.value}-${(currentMonth.value + 1)
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  // Check if the date is in the past
  const isPastDate = dateToCheck < new Date();

  // Check if the date is locked
  const isLockedDate =
    props.lockedDates && props.lockedDates.includes(dateString);

  // Return the disabled status
  return {
    isDisabled: isPastDate || isLockedDate,
    isLocked: isLockedDate,
  };
};

const toggleDate = (day) => {
  if (day) {

    if (!checkInDate.value) {
      // If check-in is not set, set it to the selected day
      checkInDate.value = new Date(currentYear.value, currentMonth.value, day);
    } else if (
      !checkOutDate.value &&
      new Date(currentYear.value, currentMonth.value, day) > checkInDate.value
    ) {
      // If check-out is not set and selected day is after check-in, set it to check-out
      checkOutDate.value = new Date(currentYear.value, currentMonth.value, day);
    } else {
      // Reset check-in and check-out if the user selects a new check-in date
      checkInDate.value = new Date(currentYear.value, currentMonth.value, day);
      checkOutDate.value = null;
    }
  }
};

const isUnlocking = (day) => {
  const dateString = `${currentYear.value}-${(currentMonth.value + 1)
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return selectedUnlockDates.value.has(dateString);
};

const isSelected = (day) => {
  const dateString = `${currentYear.value}-${(currentMonth.value + 1)
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return selectedDates.value.has(dateString);
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const close = () => {
  emit("close");
};
</script>
  
  <style scoped>
.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.checkin-button,
.checkout-button,
.close-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  flex: 1;
}

.checkin-button {
  background-color: #4caf50;
}

.checkin-button:hover,
.checkout-button:hover,
.close-button:hover {
  opacity: 0.9;
}

.close-button {
  margin-left: auto;
  background-color: #949494;
}

.datepicker {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.calendar {
  margin-bottom: 20px;
  border: 2px solid #8e4000;
  border-radius: 8px;
  padding: 10px;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.nav-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 5px;
}

.day-header {
  font-weight: bold;
  text-align: center;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
}

.day.selected {
  background-color: rgba(255, 99, 71, 0.5);
  border: 2px solid #ab4736;
  border-radius: 10px;
  transform: scale(1.05);
  color: white;
}

.day:not(.selected) {
  background-color: transparent;
  border: 1px solid #ccc;
  color: rgba(54, 14, 8, 0.881);
}

.day.locked {
  position: relative;
  background-color: rgba(48, 114, 49, 0.868);
  color: #380802;
  cursor: pointer;
}

.day.locked::before {
  content: "\1F512";
  font-size: 20px;
  position: absolute;
  top: 5px;
  right: 0px;
  opacity: 0.8;
}

.day.unlocking::before {
  content: "\1F513";
  font-size: 20px;
  position: absolute;
  top: 5px;
  right: 0px;
  opacity: 0.8;
}

.day.locked span {
  visibility: visible;
}

.day.disabled {
  color: #ccc;
  cursor: not-allowed;
}
</style>
   -->