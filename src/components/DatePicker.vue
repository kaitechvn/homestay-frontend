<template>
  <div class="datepicker">
    <h3>Available Date</h3>
    <div class="calendar">
      <div class="header">
        <button @click="prevMonth" class="nav-button">&lt;</button>
        <h4>{{ $t(`months.${monthNames[currentMonth]}`)}} {{ currentYear }}</h4>
        <button @click="nextMonth" class="nav-button">&gt;</button>
      </div>
      <div class="days-of-week">
        <div v-for="day in daysOfWeek" :key="day" class="day-header">
          {{ $t(`day_of_week.${day}`) }}
        </div>
      </div>
      <div class="days-grid">
        <div
          v-for="(day, index) in daysInMonth"
          :key="index"
          class="day"
          :style="{ cursor: !disabled ? 'pointer' : 'default' }"
          :class="{
            selected: isSelected(day),
            disabled: isDisabled(day).isDisabled && !isDisabled(day).isLocked,
            locked: isDisabled(day).isLocked,
            unlocking: isUnlocking(day),
          }"
          @click="!disabled ? toggleDate(day) : null"
          :disabled="isDisabled(day)"
        >
          {{ day }}
        </div>
      </div>
    </div>
    <div v-if="!disabled" class="button-container">
      <button  @click="lockDates" class="lock-button">Lock</button>
      <button @click="unlockDates" class="unlock-button">Unlock</button>
      <button @click="close" class="close-button">Close</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from "vue";
import { useHomestayStore } from "@/stores/homestayAdminStore";

const homestayStore = useHomestayStore();
const emit = defineEmits(["select-dates", "close", "reopenDatePicker"]);

const props = defineProps({
  lockedDates: {
    type: Array,
    default: () => [],
  },
  homestayId: {
    type: Number,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const currentDate = ref(new Date());
const selectedDates = ref(new Set());
const selectedUnlockDates = ref(new Set());

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const daysInMonth = computed(() => {
  const start = new Date(currentYear.value, currentMonth.value, 1);
  const end = new Date(currentYear.value, currentMonth.value + 1, 0);
  const days = [];

  for (let i = 0; i < start.getDay(); i++) {
    days.push("");
  }

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

  const isPastDate = dateToCheck < new Date();

  const isLockedDate =
    props.lockedDates && props.lockedDates.includes(dateString);

  return {
    isDisabled: isPastDate || isLockedDate,
    isLocked: isLockedDate,
  };
};

const toggleDate = (day) => {
  if (day) {
    const dateString = `${currentYear.value}-${(currentMonth.value + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    const isLockedDate = isDisabled(day).isLocked;

    if (isLockedDate) {
      // Toggle unlocking selection for locked dates
      if (selectedUnlockDates.value.has(dateString)) {
        selectedUnlockDates.value.delete(dateString);
      } else {
        selectedUnlockDates.value.add(dateString);
      }
    } else if (!isDisabled(day).isDisabled) {
      // Toggle regular date selection
      if (selectedDates.value.has(dateString)) {
        selectedDates.value.delete(dateString);
      } else {
        selectedDates.value.add(dateString);
      }
    }

    emit("select-dates", Array.from(selectedDates.value));
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

async function lockDates() {
  try {
    const datesToLock = Array.from(selectedDates.value);
    await homestayStore.addLockDate(props.homestayId, datesToLock);
    emit("reopenDatePicker"); 

    selectedDates.value.clear(); 
  } catch (error) {
    console.error("Failed to lock dates:", error);
  }
}

const unlockDates = async () => {
  try {
    const datesToUnlock = Array.from(selectedUnlockDates.value);
    if (datesToUnlock.length === 0) {
      console.error("No dates selected to unlock."); 
      return; 
    }

    await homestayStore.removeLockDate(props.homestayId, datesToUnlock);
    emit("reopenDatePicker"); 

    selectedUnlockDates.value.clear(); 
  } catch (error) {
    console.error("Failed to unlock dates:", error); 
  }
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
  display: flex; /* Use flexbox for inline alignment */
  justify-content: space-between; /* Space between buttons */
  align-items: center; /* Center align buttons vertically */
  margin-top: 10px; /* Add some margin above the button container */
}

.lock-button,
.unlock-button,
.close-button {
  background-color: #ff4d4d; /* Base color for all buttons */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px; /* Add space between buttons */
  flex: 1; /* Allow buttons to grow equally */
}

.unlock-button {
  background-color: #4caf50; /* Different color for unlock button */
}

.lock-button:hover,
.unlock-button:hover,
.close-button:hover {
  opacity: 0.9; /* Slight opacity change on hover */
}

.close-button {
  margin-left: auto;
  background-color: #949494; /* Different color for unlock button */
  /* Push the close button to the right */
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
  background-color: rgba(
    48,
    114,
    49,
    0.868
  ); 
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
