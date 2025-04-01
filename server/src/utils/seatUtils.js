function generateSeats(rows, cols, aisleCols, doubleSeatRows) {
  const seats = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Dùng để tạo tên hàng A, B, C...

  // Nếu doubleSeatRows là một số, chuyển thành mảng chứa hàng đó
  if (typeof doubleSeatRows === "number") {
    doubleSeatRows = [doubleSeatRows];
  }

  for (let row = 1; row <= rows; row++) {
    const isDoubleRow = Array.isArray(doubleSeatRows) && doubleSeatRows.includes(row);

    for (let col = 1; col <= cols; col++) {
      let seatType = "SINGLE"; // Mặc định là ghế đơn

      if (aisleCols.includes(col)) {
        seatType = "AISLE"; // Nếu cột thuộc lối đi, đặt là AISLE
      }
      if (isDoubleRow) {
        seatType = "DOUBLE"; // Nếu hàng thuộc hàng ghế đôi, đổi type thành DOUBLE
      }

      let seatNumber = `${alphabet[row - 1]}${col}`;

      seats.push({
        seatNumber,
        isBooked: false,
        type: seatType,
        position: { row, col },
      });
    }
  }

  return seats;
}

module.exports = { generateSeats };
