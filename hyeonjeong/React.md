# 💡 컴포넌트

- 잠재적으로 재사용 가능한 구성 요소
- 서로 연관된 html과 js를 함께 관리할 수 있음
- 서로 다른 컴포넌트는 서로 다른 데이터와 로직으로 처리

---

## 컴포넌트 인스턴스

- 컴포넌트를 사용하는 순간 React는 해당 컴포넌트의 **독립적인 인스턴스**를 생성
- **독립성**: 동일한 컴포넌트를 여러 번 사용해도, 각 컴포넌트는 **서로 완전히 분리된 상태**를 유지

1. **독립된 상태 관리**
    - 컴포넌트 인스턴스는 각각 고유한 상태를 가짐
    - 한 인스턴스에서 상태를 변경해도 다른 인스턴스에는 영향을 미치지 않음
2. **분리된 렌더링**
    - 각 인스턴스는 독립적으로 렌더링되며, 하나의 인스턴스가 업데이트되어도 다른 인스턴스는 다시 렌더링되지 않음
3. **고유한 props와 로직**
    - 컴포넌트 인스턴스는 부모로부터 전달받은 **props**와 자신의 **로컬 상태**를 기반으로 동작
    - 동일한 컴포넌트를 사용하더라도, 다른 위치에서 다른 동작을 수행할 수 있음

---

## 작성 규칙

- 함수의 제목은 **대문자**로 시작해야 함
- 함수에서 렌더링 가능한 값(대체로 HTML 마크업)이 **반환**되어야 함

---

## 컴포넌트별 파일 관리

- 별도의 컴포넌트는 별도의 파일에서 관리하는 것이 좋음
    - 두 개 컴포넌트의 연관성이 매우 높거나 함께 있어야 작동되는 경우에만 한 파일에 작성
- 관례적으로 src 폴더 내에 components 폴더 만들어서 컴포넌트 파일들을 관리함
- **컴포넌트 함수를 `export`하고, app.jsx에서 `import` 해오는 구조**

<aside>
🔸

### **`default export`**

- 모듈에서 **하나의 주요 값**을 내보낼 때 사용
- 모듈에서 export하는 함수가 하나일 때는 반드시 작성해야 함, 안쓰면 오류남
- 가져오는(import) 쪽에서 **이름을 자유롭게 변경** 가능

### **문법**

```jsx
export default function MyComponent() {
  return <h1>Hello!</h1>;
}

import MyComponent from './MyComponent'; // 이름 자유롭게 설정 가능
import CustomName from './MyComponent';  // 이름 변경 가능
```

</aside>

```jsx
// Header.jsx
import reactImg from "../assets/react-core-concepts.png";

const reactDescriptions = ["Fundamental", "Crucial", "Core"];

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

export default function Header() {
    const description = reactDescriptions[genRandomInt(2)];
  
    return (
      <header>
        <img src={reactImg} alt="Stylized atom" />
        <h1>React Essentials</h1>
        <p>
          {description} React concepts you will need for almost any app you are
          going to build!
        </p>
      </header>
    );
  }
```

```jsx
//App.jsx
import { CORE_CONCEPTS } from './data.js';
import Header from './components/Header.jsx';
import CoreConcept from './components/CoreConcepts.jsx';
```

---

## **컴포넌트별로 css 파일 관리하기**

- components 폴더 안에 개별 컴포넌트의 css 파일 작성
- 스타일을 적용할 컴포넌트 jsx 파일에 해당 css파일을 import
- 해당 스타일을 import 해온 컴포넌트에만 스타일이 적용되는 것은 아님을 주의!

```jsx
// Header.jsx
import './Header.css';
```

---

## 컴포넌트로 관리할 필요 없는 정적 마크업

- `index.html` 에서 바로 작성 가능

```jsx
// index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/game-logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Tic-Tac-Toe</title>
  </head>
  <body>
    <header>
      <img src="game-logo.png" alt="Hand-drawn tic tac toe game board">
      <h1>Tic-Tac-Toe</h1>
    </header>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

# 💡JSX

- **JSX**는 JavaScript 코드 안에서 XML 또는 HTML 형태의 문법을 사용하는 방식.
- React 컴포넌트의 UI 구조를 정의하는 데 사용.

---

## **특징**

1. **HTML과 유사한 문법**:
    - JSX는 HTML과 유사하지만, React 컴포넌트에서 동작하도록 변환됨.
    - 예: `<div>안녕하세요</div>` 형태.
2. **JavaScript 표현식 삽입**:
    - 중괄호 `{}`를 사용하여 JavaScript 코드를 삽입 가능.
    - 예: `<h1>{title}</h1>`.
3. **Babel 변환**:
    - JSX는 브라우저가 직접 이해할 수 없기 때문에 Babel을 통해 일반 JavaScript로 변환.

---

## **문법**

1. **단일 루트 요소**:
    - JSX는 하나의 부모 요소로 감싸야 함.
    - 올바른 예: `<div><h1>Title</h1></div>`
    - 잘못된 예: `<h1>Title</h1><p>Description</p>` (루트 요소가 여러 개)
2. **CamelCase 속성명**:
    - HTML 속성과 달리 JSX는 camelCase 사용.
    - 예: `class` → `className`, `onclick` → `onClick`.
3. **Self-closing 태그**:
    - 닫는 태그가 없는 요소는 반드시 self-closing 형식으로 작성.
    - 예: `<img />`, `<input />`

# 💡 동적 데이터 출력

## **중괄호 문법 `{}` 활용**

- 요소 태그 사이에 넣을 수 있음
- 속성 값으로 사용할 수 있음
- 중괄호 안에는 아무 자바스크립트 표현식을 쓸 수 있음

```jsx
const reactDescriptions = ['Fundamental', 'Crucial', 'Core'];

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function Header() {
  const description = reactDescriptions[genRandomInt(2)]
  
  return (
    <header>
      <img src="src/assets/react-core-concepts.png" alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        **{description} React concepts you will need for almost any app you are
        going to build!**
      </p>
    </header>
  );
}
```

> 변수에 값 따로 저장하는 것이 보기 편함
> 

## 동적 속성 설정 & 이미지 파일 로딩

1. 해당 이미지 경로를 포함하는 자바스크립트 변수를  `import`
2. src 속성 값으로 중괄호 안에 해당 변수 작성
    - 따옴표 생략!

> src 속성 값으로 이미지 경로 바로 작성하면 배포 시에 이미지 파일 못 찾을 수 있음, 따로 import해오면 빌드 과정에서 잘 처리됨
> 

```jsx
**import reactImg from './assets/01-starting-project/src/assets/react-core-concepts.png';**

const reactDescriptions = ['Fundamental', 'Crucial', 'Core'];

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function Header() {
  const description = reactDescriptions[genRandomInt(2)]

  return (
    <header>
      <img **src={reactImg}** alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {description} React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  );
}
```

# 💡 이벤트 처리

## 이벤트 전달 구조

- **부모 컴포넌트(App)**
    - 이벤트 핸들러를 정의하고, 어떤 로직을 실행할지 결정.
    - 자식 컴포넌트에 필요한 데이터와 핸들러를 props로 전달.
- **자식 컴포넌트(TabButton)**
    - 부모로부터 전달받은 핸들러를 특정 UI 요소의 이벤트와 연결.
    - 클릭 이벤트 발생 시 부모의 핸들러가 호출됨.

1. **이벤트 핸들러 정의**
    - 부모 컴포넌트에서 **이벤트 핸들러 함수**를 정의.
    - 클릭 시 수행할 로직을 이 함수에 작성.
    
    ```jsx
    function App() {
      function handleSelect(selectedButton) {
        console.log(selectedButton); // 버튼 클릭 시 실행됨
      }
    
      return 
      ...
    ```
    
2. **함수 전달 (Props 활용)**
    - 자식 컴포넌트에 이벤트 핸들러를 **props로 전달**.
    - 필요한 경우 **인자**를 전달하려면 화살표 함수를 사용.
        - 어떤 버튼 클릭했는지 파악 위해 인자 필요
    
    ```jsx
    <TabButton onSelect={() => handleSelect('components')}>Components</TabButton>
    
    ```
    
3. **이벤트 실행**
    - 자식 컴포넌트에서 전달받은 이벤트 핸들러를 실제 버튼의 `onClick`에 연결.
        - `onClick`속성으로 함수를 호출하면 안됨!
    - 클릭 시 부모의 핸들러 함수가 실행됨
    
    ```jsx
    // TabButton.jsx
    
    export default function TabButton({ children, onSelect }) {
        return (
          <li>
            <button onClick={onSelect}>{children}</button>
          </li>
        );
    }
    ```

    # 💡 Props

- 컴포넌트를 설정하는 커스텀 속성
    - 커스텀  속성 prop을 컴포넌트에 지정하여 전달받는 컴포넌트에서 사용
- 모든 형태의 데이터를 props 값으로 전달할 수 있음

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/1030b8f0-e73f-4d8b-93a9-b2a278b200c5/050c5a06-83ac-4176-8232-dac5977833fa/image.png)

> 1.  커스텀 컴포넌트의 속성은 키로, 속성값은 값으로 그룹화됨
2. 컴포넌트 함수는 props라는 하나의 매개변수를 받게 됨
3. 컴포넌트 속성으로 작성했던 props의 키를 참조하여 데이터 활용하게 됨
> 

```jsx
function CoreConcept(props) {
  return (
    <li>
      <img src={props.img} alt={props.title} />
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </li>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            <CoreConcept
              title="Components"
              description="The core UI building block."
              img={componentsImg}
            />

            <CoreConcept />
            <CoreConcept />
            <CoreConcept />
          </ul>
        </section>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}

```

## props 대체 문법

### data.js 파일에서 데이터 가져오기

- import문 작성

```jsx
// data.js
import componentsImg from './assets/components.png';
import propsImg from './assets/config.png';
import jsxImg from './assets/jsx-ui.png';
import stateImg from './assets/state-mgmt.png';

export const CORE_CONCEPTS = [
  {
    image: componentsImg,
    title: 'Components',
    description:
      'The core UI building block - compose the user interface by combining multiple components.',
  },
  {
    image: jsxImg,
    title: 'JSX',
    description:
      'Return (potentially dynamic) HTML(ish) code to define the actual markup that will be rendered.',
  },
  {
    image: propsImg,
    title: 'Props',
    description:
      'Make components configurable (and therefore reusable) by passing input data to them.',
  },
  {
    image: stateImg,
    title: 'State',
    description:
      'React-managed data which, when changed, causes the component to re-render & the UI to update.',
  },
];
```

```jsx
// app,jsx

// data.js에서 CORE_CONCEPTS를 변수로 export했기 때문에 중괄호 문법으로 import
import { CORE_CONCEPTS } from './data.js';

function CoreConcept(props) {
  return (
    <li>
      <img src={props.image} alt={props.title} />
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </li>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            <CoreConcept
              title={CORE_CONCEPTS[0].title}
              description={CORE_CONCEPTS[0].description}
              image={CORE_CONCEPTS[0].image}
            />
            <CoreConcept
              title={CORE_CONCEPTS[1].title}
              description={CORE_CONCEPTS[1].description}
              image={CORE_CONCEPTS[1].image}
            />
          </ul>
        </section>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}
```

> 동일한 컴포넌트에서 접근하는 항목의 인덱스에 따라 입력 데이터 달라져 동적인 설정이 가능해짐
> 

### 리스트 데이터 동적 출력

- **`map()` 메서드 사용**: 데이터를 순회하며 각 항목을 렌더링할 JSX로 변환
- **`key` 속성 설정**: React는 각 컴포넌트를 고유하게 식별하기 위해 `key` 속성이 필요

```jsx
import { CORE_CONCEPTS } from "./data.js"; 
 
 return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            **{CORE_CONCEPTS.map((conceptItem) => (
               <CoreConcept key={conceptItem.title} {...conceptItem} />
            ))}**
          </ul>
        </section>
       ...
```

### **스프레드 문법 활용하여 코드 줄이기**

- 컴포넌트 태그에서 중괄호 안에 스프레드 연산자 사용하여 키값쌍 알아서 뽑아내도록 할 수 있음
    - 컴포넌트 함수에서 정의한 속성과 이름이 정확히 같아야 함

```jsx
function CoreConcept(props) {
  return (
    <li>
      <img src={props.image} alt={props.title} />
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </li>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            <CoreConcept
              title={CORE_CONCEPTS[0].title}
              description={CORE_CONCEPTS[0].description}
              image={CORE_CONCEPTS[0].image}
            />
            **<CoreConcept {...CORE_CONCEPTS[1]}/>
            <CoreConcept {...CORE_CONCEPTS[2]}/>
            <CoreConcept {...CORE_CONCEPTS[3]}/>**
          </ul>
        </section>
        <h2>Time to get started!</h2>
      </main>
    </div>
  );
}
```

### 구조분해할당 활용하여 코드 줄이기

- 매개변수 props의 속성들을 분해하여 앞에 `props.` 붙이지 않고 바로 사용할 수 있음
    - 데이터 넘겨줄 때 속성 이름 정확히 일치시켜야 함

```jsx
function CoreConcept({image, title, description}) {
  return (
    <li>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}
```

## children Prop

- 컴포넌트 태그의 **열고 닫는 사이에 전달된 내용**을 나타내는 특수한 Prop
- 컴포넌트가 **중첩된 콘텐츠**를 표시하도록 설계할 때 사용

```jsx
function Wrapper({ children }) {
    return <div className="wrapper">{children}</div>;
}

// 사용
<Wrapper>
    <p>이 내용이 children으로 전달됩니다.</p>
</Wrapper>

```

# 💡 `...props`로 props 전달하기

## **`...props`**

- **정의**: `...props`는 자바스크립트의 **스프레드 연산자**를 활용하여 컴포넌트에 전달된 모든 props를 하위 요소에 일괄적으로 전달하는 방법.
- **장점**:
    - 컴포넌트에 전달되는 props를 하나씩 지정하지 않아도 모든 props를 자동으로 전달.
    - 코드가 간결하고 확장성이 높아짐.

---

## 적용

1. 컴포넌트에서 props를 받을 때, `{ ...props }`를 추가로 정의
2. 하위 요소에 전달할 때 `...props`를 사용하여 나머지 속성을 모두 포함시킴
- 예시 1

```jsx
// Examples.jsx
export default function Examples() {
 
  return (
    <Section title="Examples" id="examples">
      <menu>
      </menu>
      {tabContent}
    </Section>
  );
}

// Section.jsx
export default function Section({ title, children, ...props }) {
  return (
    <section {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

> `...props` 를 통해 id 속성도 전달 받게 됨
> 
- 예시2

```jsx

function CustomButton({ children, isActive, ...props }) {
  return (
    <button className={isActive ? "active" : ""} {...props}>
      {children}
    </button>
  );

```

- 상세 설명
    
    ### 이전 방식
    
    - 개별적으로 props를 정의하고 전달.
    - 버튼 컴포넌트에 `onSelect`와 같은 핸들러를 명시적으로 전달.
        
        ```jsx
        <button
          className={isSelected ? "active" : undefined}
          onClick={onSelect}
        >
        ```
        
    
    ### 변경된 방식
    
    - **`...props`** 사용으로 `onClick`과 같은 props를 명시하지 않아도 자동으로 전달.
    - **유연성 증가**: 추가적인 props를 전달하기 쉬워짐.
        
        ```jsx
        javascript
        코드 복사
        <button className={isSelected ? "active" : undefined} {...props}>
        
        ```
        
    

---

## **`...props` 사용의 이점**

1. **코드 간결화**
    - 반복적인 선언 없이 props를 한 번에 전달 가능.
    - **예시**:
        
        ```jsx
        export default function TabButton({ children, isSelected, ...props }) {
          return (
            <button className={isSelected ? "active" : undefined} {...props}>
              {children}
            </button>
          );
        }
        ```
        
2. **유연성 증가**
    - 새로운 props를 추가할 때 컴포넌트 수정 없이 전달 가능.
    - **예시**: 아래와 같이 `data-testid`나 `aria-label` 등 다양한 props를 쉽게 전달.
        
        ```jsx
        <TabButton
          isSelected={true}
          onClick={handleClick}
          data-testid="tab-button"
          aria-label="Tab button"
        />
        ```
        
3. **컴포넌트 재사용성 강화**
    - 다목적 컴포넌트로 활용 가능.
    - `TabButton`이 어떤 props를 받을지 명시적으로 나열하지 않아도 됨.

---

## **`...props` 사용 시 주의사항**

1. **과도한 의존 방지**
    - 명확한 props가 필요할 때는 특정 props를 직접 선언하여 가독성 유지.
    - 예: 필수적인 `children`이나 `className`은 명시적으로 정의.
2. **`...props` 우선순위**
    - 컴포넌트 내부에서 직접 정의된 props가 `...props`보다 우선 적용.
    - **예시**:내부에서 `className`을 재정의하면 `className="primary"`는 덮어써짐.
        
        ```jsx
        <TabButton className="primary" data-custom="example" />
        ```
        
3. **의미 없는 props 전달 방지**
    - 불필요한 props가 DOM 요소에 그대로 전달되지 않도록 주의.

---

## **활용 사례**

1.  기본적인 컴포넌트의 확장
- 여러 버튼 스타일이나 핸들러를 지원하는 공통 버튼 컴포넌트 제작.
    
    ```jsx
    function CustomButton({ children, variant, ...props }) {
      return (
        <button className={`btn ${variant}`} {...props}>
          {children}
        </button>
      );
    }
    ```
    
1. 래퍼(wrapper) 컴포넌트
- `Section`과 같은 레이아웃 컴포넌트 제작.
    
    ```jsx
    
    export default function Section({ title, children, ...props }) {
      return (
        <section {...props}>
          <h2>{title}</h2>
          {children}
        </section>
      );
    }
    ```