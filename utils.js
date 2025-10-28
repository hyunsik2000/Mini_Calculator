let currentInput = "";
let operator = "";
let previousInput = "";

const numDisplay = document.querySelector(".display-text");

document.querySelectorAll(".button").forEach((key) => {
  // 모든 버튼 클래스에 이벤트 리스너를 부착 할거임
  key.addEventListener("click", () => {
    //버튼 클릭 시 아래 동작 수행
    const value = key.textContent; // 버튼의 텍스트를 value 변수에 저장
    console.log(value); // 값을 콘솔에 테스트
    if (!isNaN(value) || value === ".") {
      // 숫자 거나 "." 일 때
      appendNumber(value);
    } else if (value === "C") {
      // C (Clear) 버튼을 눌렀을 때
      eraseAll();
    } else if (value === "±") {
      // ± (부호 변환) 버튼을 눌렀을 때
      changeSign();
    } else {
    }
  });
});

function updateNumDisplay(value) {
  // 디스플레이에 값을 보이게 하는 함수
  numDisplay.value = value;
}

function appendNumber(value) {
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
  updateNumDisplay(currentInput);
}

function changeSign() {
  // 부호 변환을 위한 함수
  if (!currentInput) return; // 예외 상황 1. 아무 입력 없을 때  -> 무시
  if (currentInput.startsWith("-"))
    currentInput = currentInput.slice(1); // 음수라면 slice(1)를 통해 양수로
  else currentInput = "-" + currentInput; // 음수가 아니라면 "-"만 붙이기
  updateNumDisplay(formatForDisplay(currentInput));
}

function formatForDisplay(value) {
  // 소숫점 정수 부분을 위한 함수
  if (!value) return ""; // 예외 상황 1. 빈 값이라면 빈 문자열 출력
  let sign = ""; // 부호를 담을 변수
  if (value[0] === "-") {
    // 초기에 음수 부호를 확인하여 음수 양수 확인하기
    sign = "-";
    value = value.slice(1); // 부호를 제외한 숫자 부분만 남기기
  }

  const [intValue = "", lastValue = ""] = value.split(".");

  const hasDot = value.includes("."); // 값에 현재 소숫점이 있느냐

  // 정수부 포맷: 비어 있으면 그대로(예: "."만 입력 시 intRaw="")
  let intFormatted = "";
  if (intValue !== "") {
    // 선행 0 정리: "00012" -> "12" (단, 전부 0이면 "0")
    const intClean = intValue.replace(/^0+(?=\d)/, "") || "0";
    intFormatted = Number(intClean).toLocaleString(
      navigator.language || "ko-KR"
    );
  }

  // 조립
  if (hasDot) {
    // ".", "12.", ".5", "0.25" 등
    return sign + (intFormatted || "") + "." + lastValue;
  } else {
    // 순수 정수
    return sign + (intFormatted || ""); // intRaw가 ""일 수 있으나 그런 경우는 위에서 반환됨
  }
}
