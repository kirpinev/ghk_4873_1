import { useEffect } from "react";

import { ButtonMobile } from "@alfalab/core-components/button/mobile";

import { Typography } from "@alfalab/core-components/typography";

import { LS, LSKeys } from "./ls";
import { appSt } from "./style.css";
import { ThxLayout } from "./thx/ThxLayout";
import { Gap } from "@alfalab/core-components/gap";
import { ChangeEvent, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { sendDataToGA } from "./utils/events.ts";
import { SliderInput } from "@alfalab/core-components/slider-input";
import { AmountInput } from "@alfalab/core-components/amount-input";
import { BottomSheet } from "@alfalab/core-components/bottom-sheet";
import star from "./assets/star.png";
import payment from "./assets/payment.png";
import cal from "./assets/cal.png";
import money from "./assets/money.png";

interface Month {
  text: string;
  isNumber: boolean;
  isNew: boolean;
  number: number;
}

const standardMonths: Month[] = [
  { text: "1 мес.", isNumber: true, isNew: true, number: 1 },
  { text: "2 мес.", isNumber: true, isNew: true, number: 2 },
  { text: "3 мес.", isNumber: true, isNew: true, number: 3 },
  { text: "4 мес.", isNumber: true, isNew: true, number: 4 },
  { text: "5 мес.", isNumber: true, isNew: true, number: 5 },
  { text: "6 мес.", isNumber: true, isNew: true, number: 6 },
  { text: "7 мес.", isNumber: true, isNew: true, number: 7 },
  { text: "8 мес.", isNumber: true, isNew: true, number: 8 },
  { text: "9 мес.", isNumber: true, isNew: true, number: 9 },
  { text: "10 мес.", isNumber: true, isNew: true, number: 10 },
  { text: "11 мес.", isNumber: true, isNew: true, number: 11 },
  { text: "12 мес.", isNumber: true, isNew: true, number: 12 },
  { text: "13 мес.", isNumber: true, isNew: true, number: 13 },
  { text: "14 мес.", isNumber: true, isNew: true, number: 14 },
  { text: "15 мес.", isNumber: true, isNew: true, number: 15 },
  { text: "16 мес.", isNumber: true, isNew: true, number: 16 },
  { text: "17 мес.", isNumber: true, isNew: true, number: 17 },
  { text: "18 мес.", isNumber: true, isNew: true, number: 18 },
];

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState(10_000);
  const [thx, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [months, setMonths] = useState<Month[]>([
    { text: "1 мес.", isNumber: true, isNew: false, number: 1 },
    { text: "3 мес.", isNumber: true, isNew: false, number: 3 },
    { text: "6 мес.", isNumber: true, isNew: false, number: 6 },
    { text: "12 мес.", isNumber: true, isNew: false, number: 12 },
    { text: "Другой", isNumber: true, isNew: false, number: 99 },
  ]);
  const [month, setMonth] = useState<Month>(months[0]);
  const [modalMonth, setModalMonth] = useState<Month | null>();
  const [paymentSum, setPaymentSum] = useState(0);

  const countSum = (amount: number, month: number) => {
    setPaymentSum((amount / 1000) * 50 * month);
  };

  const submit = () => {
    setLoading(true);
    sendDataToGA({
      sum: amount,
      payment: paymentSum,
      term: month.number,
      commission: paymentSum + amount,
    }).then(() => {
      setLoading(false);
      setThx(true);
      LS.setItem(LSKeys.ShowThx, true);
    });
  };

  const formatPipsValue = (value: number) =>
    `${value.toLocaleString("ru-RU")} ₽`;

  const handleSumInputChange = (
    _: ChangeEvent<HTMLInputElement>,
    { value }: { value: number | string },
  ) => setAmount(Number(value) / 100);

  const handleSumSliderChange = ({ value }: { value: number }) =>
    setAmount(value);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  useEffect(() => {
    countSum(amount, month.number);
  }, [amount, month]);

  if (thx) {
    return <ThxLayout />;
  }

  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleResponsive
          font="system"
          tag="h3"
          view="medium"
          className={appSt.productsTitle}
        >
          Деньги под рукой
        </Typography.TitleResponsive>
        <Gap size={8} />
        <Typography.Text
          tag="p"
          view="primary-medium"
          style={{ marginBottom: 0 }}
        >
          Доступный лимит без процентов
        </Typography.Text>

        <Gap size={28} />

        <Typography.Text tag="p" view="primary-small" weight="bold">
          Выберите сумму и срок
        </Typography.Text>

        <SliderInput
          block={true}
          value={amount * 100}
          sliderValue={amount}
          onInputChange={handleSumInputChange}
          onSliderChange={handleSumSliderChange}
          onBlur={() => setAmount((prev) => clamp(prev, 1, 30_000))}
          min={1}
          max={30_000}
          range={{ min: 1, max: 30_000 }}
          pips={{
            mode: "values",
            values: [1, 30_000],
            format: { to: formatPipsValue },
          }}
          step={1}
          Input={AmountInput}
          labelView="outer"
          size={48}
        />

        <Gap size={28} />

        <Swiper
          style={{ marginLeft: "0", width: "100%", overflowX: "hidden" }}
          spaceBetween={8}
          slidesPerView="auto"
          updateOnWindowResize={true}
        >
          {months.map((m) => (
            <SwiperSlide
              key={m.number}
              onClick={() => {
                setMonth((prev) => (m.number === 99 ? prev : m));

                if (m.number === 99) {
                  setModalOpen(true);
                }
              }}
              className={appSt.swSlide({
                selected: m.text === month.text,
              })}
            >
              {m.text}
            </SwiperSlide>
          ))}
        </Swiper>

        <Gap size={28} />

        <div className={appSt.reminder}>
          <img src={star} width={24} height={24} alt="" />
          <Typography.Text
            tag="p"
            view="primary-small"
            style={{ marginBottom: 0 }}
          >
            Можно взять еще в любой момент. <br /> Лимит восстановится с
            погашением.
          </Typography.Text>
        </div>

        <Gap size={28} />
      </div>

      <BottomSheet
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <div style={{ overflow: "hidden", width: "100%" }}>
          <Typography.Text tag="p" view="primary-large" weight="bold">
            Выберите срок
          </Typography.Text>

          <Swiper
            style={{ marginLeft: "0" }}
            spaceBetween={8}
            slidesPerView="auto"
          >
            {standardMonths.map((m) => (
              <SwiperSlide
                key={m.number}
                onClick={() => {
                  setModalOpen(false);

                  const result: Month[] = [];

                  [...months, m].forEach((m1) => {
                    if (!result.find((m2) => m2.number === m1.number)) {
                      result.push(m1);
                    }
                  });

                  setMonths([
                    ...result
                      .filter((m3) => m3.number !== modalMonth?.number)
                      .sort((a, b) => a.number - b.number),
                  ]);
                  setModalMonth(m);
                  setMonth(m);
                }}
                className={appSt.swSlide({
                  selected: m.text === month.text,
                })}
              >
                {m.text}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </BottomSheet>

      <Gap size={96} />

      <div className={appSt.bottomBtnThx}>
        <div className={appSt.result}>
          <Typography.Text
            tag="p"
            view="primary-medium"
            style={{ marginBottom: 0, textAlign: "center" }}
          >
            Вы берете
          </Typography.Text>
          <Typography.Text
            tag="p"
            view="primary-medium"
            weight="bold"
            style={{ marginBottom: 0, textAlign: "center" }}
          >
            {amount.toLocaleString("ru-RU")} ₽
          </Typography.Text>

          <Gap size={12} />

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "73px",
              }}
            >
              <img src={payment} width={25} height={25} alt="" />
              <Typography.Text
                tag="p"
                view="primary-medium"
                color="secondary"
                style={{ marginBottom: 0 }}
              >
                платёж
              </Typography.Text>
              <Typography.Text
                tag="p"
                view="primary-medium"
                style={{ marginBottom: 0 }}
              >
                {(amount + paymentSum).toLocaleString("ru-RU")} ₽
              </Typography.Text>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: "73px",
                }}
              >
                <img src={cal} width={25} height={25} alt="" />
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  color="secondary"
                  style={{ marginBottom: 0 }}
                >
                  срок
                </Typography.Text>
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  style={{ marginBottom: 0 }}
                >
                  {month.text}
                </Typography.Text>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                minWidth: "73px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={money} width={25} height={25} alt="" />
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  color="secondary"
                  style={{ marginBottom: 0 }}
                >
                  комиссия
                </Typography.Text>
                <Typography.Text
                  tag="p"
                  view="primary-medium"
                  style={{ marginBottom: 0 }}
                >
                  {paymentSum.toLocaleString("ru-RU")} ₽
                </Typography.Text>
              </div>
            </div>
          </div>
        </div>
        <Gap size={16} />
        <ButtonMobile
          loading={loading}
          onClick={submit}
          block
          view="primary"
          href=""
        >
          Перевести на Альфа-Карту
        </ButtonMobile>
      </div>
    </>
  );
};
