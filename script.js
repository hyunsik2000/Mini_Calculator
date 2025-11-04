let currentInput = "";
let operator = "";
let previousInput = "";

const numDisplay = document.querySelector(".display-text");
const numSubDisplay = document.querySelector(".display-subtext");

document.querySelectorAll(".button").forEach((element) => {
  // 엘리먼트로도 접근 가능
  // 모든 버튼 클래스에 이벤트 리스너를 부착 할거임
  element.addEventListener("click", () => {
    //버튼 클릭 시 아래 동작 수행
    const value = element.textContent.trim(); // 버튼의 텍스트를 value 변수에 저장
    if (!isNaN(value) || value === ".") {
      // 숫자 거나 "." 일 때
      appendValue(value);
    } else if (value === "C") {
      // C (Clear) 버튼을 눌렀을 때
      eraseAll();
    } else if (value === "±") {
      // ± (부호 변환) 버튼을 눌렀을 때
      changeSign();
    } else if (element.classList.contains("operator")) {
      if (value === "=") {
        // "=" 버튼을 누른거면
        if (previousInput !== "" && currentInput !== "" && operator) {
          // 모든 값이 존재 할 때 만 계산 -> 아니면 NaN 문제 발생함
          previousInput = String(
            calculateNum(previousInput, operator, currentInput)
          ); // 첫번째 값, 두번째 값, 이미 저장 되어 있던 operator 값들을 계산하여 이전 값에 저장
          currentInput = ""; // 계산 완료 후 현재 값 디스플레이 초기화 => subtext 부분은 놔두기
          operator = ""; //  초기화 하여 다음 새로운 연산자를 받아올 준비
          updateSubNumDisplay(formatForDisplay(previousInput)); // 출력
          updateNumDisplay(currentInput); // 출력
        }
        return;
      }

      if (previousInput === "") {
        // 이전 값이 존재 하지 않을 때 => 첫 연산이 시작될 때
        previousInput = currentInput; // 다음 연산을 위해 처음 계산 값을 prev에 저장
        currentInput = ""; // 현재 값 디스플레이 초기화
        operator = value; // 누른 연산자 저장
        updateSubNumDisplay(formatForDisplay(previousInput)); // 출력
        updateNumDisplay(currentInput); // 출력
      } else {
        // 이전 값이 존재 할 때
        if (currentInput === "") {
          // 아직 연산될 숫자를 입력하지 않았을 경우 이기 때문에 operator 값만 저장
          operator = value;
          return;
        }
        previousInput = String(
          calculateNum(previousInput, operator, currentInput)
        ); // 계산 값을 prev에 저장 이때 이전 operator 값으로 실시 해야함
        currentInput = ""; // 계산 완료 했기 때문에 디스 플레이 초기화
        operator = value; // 새로운 연산자 값 저장
        updateSubNumDisplay(formatForDisplay(previousInput)); // 출력
        updateNumDisplay(currentInput); // 출력
      }
    }
  });
});

function appendValue(value) {
  if (value === ".") {
    // 입력받은 값이 "."일때
    if (currentInput.includes(".")) return; // 이미 소숫점이 존재한다면 Pass (예외 상황 1)
    if (currentInput === "") {
      // 빈 값일 경우 라면  (예외 상황 2)
      currentInput = "0."; //앞자리에 0이 있는 상태로 저장
      updateNumDisplay(formatForDisplay(currentInput)); // 결과: "0."
      return;
    }
    currentInput += "."; // 예외 상황을 제외한 경우엔 그냥 저장
    updateNumDisplay(formatForDisplay(currentInput));
    return;
  }

  if (currentInput === "0") {
    // 0만 있는 상황이라면 (예외 상황 1)
    currentInput = value;
  } else {
    // 그것이 아니라면 붙여서 진행
    currentInput += value;
  }
  updateNumDisplay(formatForDisplay(currentInput));
}

function eraseAll() {
  // 입력값 모두 지우기 위한 함수
  currentInput = "";
  previousInput = "";
  operator = "";
  updateNumDisplay(currentInput);
  updateSubNumDisplay(previousInput);
}

function changeSign() {
  // 부호 변환을 위한 함수
  if (!currentInput || currentInput === "0") return; // 예외 상황 1. 아무 입력 없을 때  -> 무시
  if (currentInput.startsWith("-"))
    currentInput = currentInput.slice(1); // 음수라면 slice(1)를 통해 양수로
  else currentInput = "-" + currentInput; // 음수가 아니라면 "-"만 붙이기
  updateNumDisplay(formatForDisplay(currentInput));
}

function formatForDisplay(value) {
  // 디스플레이에 숫자에 ',' 추가하는 함수
  if (!value) return ""; // 예외 상황 1. 빈 값이라면 빈 문자열 출력
  let sign = ""; // 부호를 담을 변수
  if (value[0] === "-") {
    // 초기에 음수 부호를 확인하여 음수 양수 확인하기
    sign = "-";
    value = value.slice(1); // 부호를 제외한 숫자 부분만 남기기
  }

  const [intValue = "", lastValue = ""] = value.split(".");

  const hasDot = value.includes("."); // 값에 현재 소숫점이 있느냐

  let intFormatted = 0; // 변환된 정수 부분 초기화

  intFormatted = Number(intValue).toLocaleString(); // 정수 부분에 대해 toLocaleString 함수를 통해 숫자에 , 추가
  // 조립
  if (hasDot) {
    // 점이 있을때
    return sign + intFormatted + "." + lastValue;
  } else {
    // 없을 때 그냥 출력
    // 순수 정수
    return sign + intFormatted;
  }
}

function updateNumDisplay(value) {
  numDisplay.value = value;
}

function updateSubNumDisplay(value) {
  numSubDisplay.value = value;
}

function calculateNum(firstOperand, operator, secondOperand) {
  // Todo. 더 확실한 검증을 위해
  // 1. 부동소수점 연산 오류 해결
  // 2. NaN이나 Infinity 처리

  const a = parseFloat(firstOperand);
  const b = parseFloat(secondOperand);

  // 2. NaN 처리 ✅ => parseFloat으로 변환 뒤 값에 NaN이 있다면
  if (isNaN(a) || isNaN(b)) {
    return 0;
  }

  let result; // 결과를 담을 변수

  switch (operator) {
    case "＋":
      result = a + b;
      break;
    case "ㅡ":
      result = a - b;
      break;
    case "×":
      result = a * b;
      break;
    case "/":
      // 0으로 나누기 처리
      if (b === 0) {
        return 0;
      }
      result = a / b;
      break;
    case "%":
      if (b === 0) {
        return 0;
      }
      result = a % b;
      break;
    default:
      return 0;
  }

  // Todo 1. 부동소수점 연산 오류 해결 ✅
  // 원래 0.1 + 0.2 = 0.30000000000000004 이 됩니다
  // 0.30000000000000004 -> 300000000.00000004 => 300000000 => 0.300000000 => 0.3
  result = Math.round(result * 1e9) / 1e9; //  1e? = 10 ^ ?,  1e1 = 10 ^ 1 , 1e3 = 10 ^ 3

  // Todo 2. Infinity 체크 ✅
  if (!isFinite(result)) {
    return 0;
  }

  return result;
}
