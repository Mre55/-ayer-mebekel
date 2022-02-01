import React, { useEffect, useState } from "react";

import { fetchWeatherWithoutDispatch } from "../redux/weather/weatherReducer";

import DetailsPage from "./DetailsPage";
import Form from "./Form";
import CurrentPollutionData from "./CurrentPollutionData";
import backIcon from "../images/backIcon.png";

const HomePage = () => {
  const [newPageData, setNewPageData] = useState();
  const [firstPageData, setFirstPageData] = useState();
  const [secondPageData, setSecondPageData] = useState();
  const [thirdPageData, setThirdPageData] = useState();
  const [fourthPageData, setFourthPageData] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [detailPage, setDetailPage] = useState(false);

  const fetchNewData = async (lat, long) => {
    const withoutDi = await fetchWeatherWithoutDispatch(lat, long);
    const [first, second, third, fourth] = await Promise.all(
      [
        [50, 50],
        [8, 37],
        [40, 40],
        [30, 20],
      ].map((coord) => fetchWeatherWithoutDispatch(coord[0], coord[1]))
    );
    setNewPageData(withoutDi);
    setFirstPageData(first);
    setSecondPageData(second);
    setThirdPageData(third);
    setFourthPageData(fourth);
  };

  useEffect(async () => {
    await fetchNewData(50, 50);
  }, []);

  const seeMore = (city) => {
    setSelectedCity(city);
    setDetailPage(!detailPage);
  };

  const getSelectedCityData = () => {
    switch (selectedCity) {
      case "Hawassa":
        return secondPageData;
      case "Addis Ababa":
        return firstPageData;
      case "Hossana":
        return thirdPageData;
      case "London":
        return fourthPageData;
      case "New":
        return newPageData;
      default:
        return firstPageData;
    }
  };

  const selectedCityData = getSelectedCityData();

  return (
    <div className="">
      <div className={`${detailPage ? "hidden" : ""}`}>
        <Form seeMore={seeMore} fetchNewData={fetchNewData} />

        <div className={`${detailPage ? "hidden" : ""}`}>
          <CurrentPollutionData
            seeMore={seeMore}
            firstPageData={firstPageData}
            secondPageData={secondPageData}
            thirdPageData={thirdPageData}
            fourthPageData={fourthPageData}
          />
        </div>
      </div>
      <div className={`${detailPage ? "" : "hidden"}`}>
        <div className="flex items-center gap-14 bg-[#35538c] text-white px-3 ">
          <button
            className="w-10"
            onClick={() => seeMore()}
            type="button"
          >
            <img src={backIcon} alt="back icon" />
          </button>
          <p className="text-sm text-white py-2 w-screen">DATA ABOUT POLLUTING GASES</p>
        </div>
        {selectedCityData?.coord && (
          <DetailsPage
            coord={selectedCityData.coord}
            list={selectedCityData.list}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
