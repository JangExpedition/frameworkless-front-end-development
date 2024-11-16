## 렌더링

- 모든 웹 애플리케이션에서 가장 중요한 기능은 데이터의 표시다.
- 데이터를 표시한다는 것은 요소를 화면이나 다른 출력 장치에 렌더링 하는 것을 의미한다.
- W3C는 프로그래밍 방식으로 요소를 렌더링하는 방식을 DOM으로 정의했다.

### 목표

- 프레임워크 없이 DOM을 효과적으로 조작하는 방법을 배운다.

### 렌더링 함수

- 순수 함수로 요소를 렌더링한다는 것 === DOM 요소가 애플리케이션 상태에만 의존한다는 것
  > view = f(state)

### 01의 문제점

- view 부분이 문제

  - 단 하나의 함수가 여러 DOM을 조작함.

  ```js
  export default (targetElement, state) => {
    const { currentFilter, todos } = state;

    const element = targetElement.cloneNode(true);

    // 하나의 함수에서 list, counter, filters 세 가지 요소를 조작하고 있다.
    const list = element.querySelector(".todo-list");
    const counter = element.querySelector(".todo-count");
    const filters = element.querySelector(".filters");

    list.innerHTML = todos.map(getTodoElement).join("");
    counter.textContent = getTodoCount(todos);

    Array.from(filters.querySelectorAll("li a")).forEach((a) => {
      if (a.textContent === currentFilter) {
        a.classList.add("selected");
      } else {
        a.classList.remove("selected");
      }
    });

    return element;
  };
  ```

  - 동일한 작업을 수행하는 여러 방법
    - `getTodoElement` 함수는 문자열을 통해 리스트 항목을 생성한다.
    - `todo count` 요소는 단순히 기존 요소에 텍스트를 추가하기만 하면 된다.
    - 필터의 경우 DOM을 직접 조작하여 classList를 추가한다.

### 02에서 01 문제점에 대한 개선 사항

- 단 하나의 함수가 여러 DOM 조작

  ```js
  import todosView from "./todos.js";
  import counterView from "./counter.js";
  import filtersView from "./filters.js";

  export default (targetElement, state) => {
    const element = targetElement.cloneNode(true);

    const list = element.querySelector(".todo-list");
    const counter = element.querySelector(".todo-count");
    const filters = element.querySelector(".filters");

    list.replaceWith(todosView(list, state));
    counter.replaceWith(counterView(counter, state));
    filters.replaceWith(filtersView(filters, state));

    return element;
  };
  ```

  - `todoView`, `counterView`, `filtersView` 세 함수로 나누어 각자 맡은 DOM 제어

- 동일한 작업을 수행하는 여러 방법
  - 사실 책에서 문제점을 지적하는 부분도 문장이 어렵게 번역되어 있어서 이해하는 데 어려웠다.
  - 그래서 DOM을 조작하는 부분을 `문자열`, `textContent`, `classList`로 통일되지 않은 방식을 사용해서 라고 해석했다.
  - 하지만 02의 완성 코드를 보면 `todoView`, `counterView`, `filtersView`의 내부 코드를 살펴보면 01과 동일하다.
  - 음... 이 부분은 잘 모르겠다.

### 02의 개선해야 할 점

- 앱 뷰의 코드를 확인해보면 올바른 함수를 수동으로 호출하고 있다.
- 구성요소 기반의 애플리케이션을 작성하려면 구성 요소 간의 상호작용에 선언적 방식을 사용해야 한다.
- 시스템은 모든 부분을 자동으로 연결해야 한다.

## 과정을 진행하며 배운 점

### 01

- DOM을 직접 조작하지 않고 `cloneNode`를 사용하여 원래 노드를 복제하고 `state` 매개 변수를 사용해 업데이트 함으로써 원본 DOM 요소를 조작하지 않는다.
- `requestAnimationFrame`을 사용한다. 이 콜백 내에서 DOM 작업을 수행하면 메인 스레드를 차단하지 않아 리페인트가 이벤트 루프에서 스케줄링되기 직전에 실행된다.

- `cloneNode`를 사용하여 원본 DOM을 직접 조작하지 않는다.

  - `cloneNode`를 통해 DOM 요소를 복제하고 이를 사용하여 업데이트를 수행한 후, 기존 노드를 교체하거나 필요한 부분을 변경함으로써 DOM의 직접 조작을 최소화한다. 이 방식은 DOM의 반복적인 직접 조작을 줄여, 재페인트나 리플로우를 최소화하는 데 기여할 수 있다.

- `requestAnimationFrame`을 사용한 DOM 작업 수행
  - `requestAnimationFrame`을 사용하면 브라우저의 리페인트 작업을 효율적으로 조율할 수 있다. 이 콜백 내에서 DOM 작업을 수행할 경우, 메인 스레드를 차단하지 않고 브라우저가 최적의 타이밍에 리페인트하도록 예약한다. 이를 통해 애니메이션과 같은 시각적 업데이트가 부드러워지고, 불필요한 연산을 방지해 성능을 향상시킬 수 있다.

### 02

- test 코드 작성법

  - 파일명.test.js 파일 생성

  ```js
  describe("테스트명", () => {
    // 각 테스트 전에 실행되는 코드
    beforeEach(() => {});

    // beforeAll: 모든 테스트 시작 전에 한 번 실행
    // afterEach: 각 테스트 후에 실행되는 코드
    // afterAll: 모든 테스트가 끝난 후에 한 번 실행

    // 테스트
    test("테스트명", () => {
      ...테스트 로직
      expect(로직결과).toBe(정답);
    })
  });
  ```

**cloneNode의 인자에 true를 주지 않을 경우**

- `filters.test.js` 테스트 코드를 실행하다가 오류가 나서 살펴보니 인자로 `true`를 안 줘서 발생하는 오류였다. 인자로 `true`를 주지 않으면 얕은 복사가 일어나 노드 자체만 복사되고 자식 노드는 복사되지 않는다.
