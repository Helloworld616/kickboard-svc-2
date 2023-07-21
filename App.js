import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "./res/index.css";

// 초기값부터 세팅하면 이후에 수월해짐
const USER_NO = "ME00001";
const INITIAL_SUMMARY = {
  usage_count: 0,
  usage_minute: 0,
  usage_meter: 0,
  carbon_reduction: 0,
};
const INITIAL_LIST = {
  list: [],
};

function App() {
  const [userName, setUserName] = useState("");
  const [usageSummary, setUsageSummary] = useState(INITIAL_SUMMARY);
  const [usageList, setUsageList] = useState(INITIAL_LIST);
  const [ptype, setPtype] = useState(1);

  const getUserName = () => {
    axios
      .get(`http://localhost:8080/api/v1/user/${USER_NO}`)
      .then((response) => {
        setUserName(response.data?.name);
      });
  };

  const getUsageSummary = () => {
    axios
      .get(
        `http://localhost:8080/api/v1/user/${USER_NO}/usage/summary?ptype=${ptype}`
      )
      .then((res) => {
        setUsageSummary({
          usage_count: res.data?.usage_count ?? 0,
          usage_minute: res.data?.usage_minute ?? 0,
          usage_meter: (res.data?.usage_meter / 1000).toFixed(1) ?? 0,
          carbon_reduction: (res.data?.carbon_reduction).toFixed(1) ?? 0,
        });
        // console.log(usageSummary);
      });
  };

  // 비동기로 순서가 꼬인다면 로직을 최대한 늘려보자
  const getUsageList = () => {
    axios
      .get(`http://localhost:8080/api/v1/user/${USER_NO}/usage?ptype=${ptype}`)
      .then((res) => {
        const data = res.data;
        const newUsage = {
          list: data.list,
        };
        setUsageList(newUsage);
      });
    console.log(usageList);
  };

  // const tabClick = (e) => {
  //   console.log(e.target.dataset.ptype);
  //   setPtype(e.target.dataset.ptype);
  //   console.log(ptype);
  // };

  const tabClick = (num) => {
    setPtype(num);
    // console.log(ptype);
  };

  const payString = (card_pay, point_pay) => {
    if (card_pay > 0 && point_pay > 0) {
      return `카드 ${card_pay}원 + 포인트 ${point_pay}P`;
    } else if (card_pay > 0) {
      return `카드 ${card_pay}원`;
    } else if (point_pay > 0) {
      return `포인트 ${point_pay}P`;
    } else {
      return "";
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  // Parameter 변수를 참고하여 useEffect 설정
  useEffect(() => {
    getUsageSummary();
    getUsageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ptype]);

  return (
    <div>
      <div className="main-title">
        <h1>서비스 이용내역</h1>
        <div>{userName}</div>
      </div>
      <hr />

      <div className="service-summary">
        <div className="service-summary-tab">
          {/* <button
            data-ptype="1"
            className={`tablinks ${ptype === 1 ? "on" : ""}`}
            onClick={tabClick}
          >
            1주일
          </button>
          <button
            data-ptype="2"
            className={`tablinks ${ptype === 2 ? "on" : ""}`}
            onClick={tabClick}
          >
            1개월
          </button>
          <button
            data-ptype="3"
            className={`tablinks ${ptype === 3 ? "on" : ""}`}
            onClick={tabClick}
          >
            3개월
          </button> */}
          <button
            data-ptype="1"
            className={`tablinks ${ptype === 1 ? "on" : ""}`}
            onClick={() => tabClick(1)}
          >
            1주일
          </button>
          <button
            data-ptype="2"
            className={`tablinks ${ptype === 2 ? "on" : ""}`}
            onClick={() => tabClick(2)}
          >
            1개월
          </button>
          <button
            data-ptype="3"
            className={`tablinks ${ptype === 3 ? "on" : ""}`}
            onClick={() => tabClick(3)}
          >
            3개월
          </button>
        </div>
        <div className="spacer-20"></div>
        <div className="service-summary-detail-container">
          <div className="color-gray">이용건수</div>
          <div>{usageSummary.usage_count}건</div>
          <div className="color-gray">이용시간</div>
          <div>{usageSummary.usage_minute}분</div>
          <div className="color-gray">이동거리</div>
          <div>{usageSummary.usage_meter}km</div>
          <div className="color-gray">탄소절감효과</div>
          <div>{usageSummary.carbon_reduction}kg</div>
        </div>
      </div>

      <hr />

      {/* "조건 ? () : ()"의 형태임 */}
      {usageList.list.length > 0 ? (
        <Fragment>
          <div class="service-list-container">
            {/* 데이터를 먼저 뽑아내고, 그것들을 템플릿에 적용한 결과물을 리턴 */}
            {usageList.list.map((item) => {
              // console.log(item);

              // 명세를 참고하여 작성
              const card_pay = item.card_pay;
              const pay_datetiem = item.pay_datetiem;
              const point_pay = item.point_pay;
              const use_distance = item.use_distance;
              const use_end_dt = item.use_end_dt;
              const use_no = item.use_no;
              const use_start_dt = item.use_start_dt;
              const use_time = item.use_time;

              // return은 소괄호임을 명심
              return (
                <Fragment key={use_no}>
                  <div class="service-list-content">
                    <div class="service-list-header">
                      <span>{use_distance}km</span>
                      <span class="color-gray ml-10">{use_time}분</span>
                    </div>
                    <div class="service-list-body">
                      <div class="color-gray">이용시간</div>
                      <div>
                        {use_start_dt} ~ {use_end_dt}
                      </div>
                      <div class="color-gray">결제일시</div>
                      <div>{pay_datetiem}</div>
                      <div class="color-gray">결제수단</div>
                      <div>{payString(card_pay, point_pay)}</div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      ) : (
        <div className="service-empty">
          <div className="service-empty-container">
            <div className="service-empty-message">조회된 정보가 없습니다.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
