import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { getAllocationAmount } from "@src/libs";
import { CustomInputNumber } from "@src/components/CustomInputNumber";
import "./RoomAllocation.scss";

const ROOM_ACCOMMODATE_AMOUNT = 4;
const DEFAULT_ALLOCATION = { adult: 1, child: 0 };
const ROOM_TYPE = [
  { key: "adult", label: "大人", tips: "年齡 20 +", min: 1, step: 1 },
  { key: "child", label: "小孩", tips: "", min: 0, step: 1 },
];

const RoomAllocation = ({ guest, room, onChange }) => {
  const isDisabled = guest === room;
  const [roomAllocation, setRoomAllocation] = useState(new Array(room).fill(DEFAULT_ALLOCATION));
  const unassignedMount = useMemo(() => {
    const assignedMount = roomAllocation.reduce((accumulator, currentValue) => {
      return accumulator + getAllocationAmount(currentValue);
    }, 0);

    return guest - assignedMount;
  }, [roomAllocation]);

  const handleCalculate = (e) => {
    const allocationMount = Number(e.target.value);
    const currentField = e.target.name.split("-")[0];
    const currentIndex = e.target.name.split("-")[1];

    const result = roomAllocation.reduce((accumulator, currentValue, index) => {
      if (index !== Number(currentIndex)) {
        return [...accumulator, currentValue];
      }

      return [...accumulator, { ...currentValue, [currentField]: allocationMount }];
    }, []);

    const assignedMount = result.reduce((accumulator, currentValue) => {
      return accumulator + getAllocationAmount(currentValue);
    }, 0);

    if (assignedMount > guest) {
      return;
    }

    setRoomAllocation(result);
    onChange(result);
  };

  if (room * ROOM_ACCOMMODATE_AMOUNT < guest) {
    return <p>房醒可容納數量不足，請重新操作</p>;
  }

  if (room > guest) {
    return <p>房間數量多於入最多住人數，請重新操作</p>;
  }

  return (
    <div className="room-allocation">
      <div className="room-allocation__title">
        住房人數 : {guest} 人 / {room} 房
      </div>
      <div className="room-allocation__unassigned">尚未分配人數：{unassignedMount} 人</div>
      <div className="room-allocation__rooms-container">
        {roomAllocation.map((allocation, index) => {
          const max = {
            adult:
              unassignedMount === 0 ? allocation.adult : ROOM_ACCOMMODATE_AMOUNT - allocation.child,
            child:
              unassignedMount === 0 ? allocation.child : ROOM_ACCOMMODATE_AMOUNT - allocation.adult,
          };

          return (
            <section className="room-allocation__room" key={index}>
              <div className="room-allocation__room__title">
                房間 : {getAllocationAmount(allocation)} 人 (容納人數：{ROOM_ACCOMMODATE_AMOUNT})
              </div>

              {ROOM_TYPE.map((roomType) => (
                <div ket={roomType.key} className="room-allocation__room__allocation">
                  <div className="room-allocation__room__allocation__title">
                    <p>{roomType.label}</p>
                    {roomType.tips && <small>{roomType.tips}</small>}
                  </div>
                  <div className="room-allocation__room__allocation__Input">
                    <CustomInputNumber
                      value={allocation[roomType.key]}
                      max={max[roomType.key]}
                      min={roomType.min}
                      step={roomType.step}
                      name={`${roomType.key}-${index}`}
                      disabled={isDisabled}
                      onChange={handleCalculate}
                      onBlur={handleCalculate}
                    />
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

RoomAllocation.propTypes = {
  guest: PropTypes.number.isRequired,
  room: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RoomAllocation;
