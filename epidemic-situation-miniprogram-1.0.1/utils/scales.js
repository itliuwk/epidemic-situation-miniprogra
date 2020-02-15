const scales = [{
    size: 3,
    num: 1000 * 1000
  },
  {
    size: 4,
    num: 500 * 1000
  },
  {
    size: 5,
    num: 200 * 1000
  },
  {
    size: 6,
    num: 100 * 1000
  },
  {
    size: 7,
    num: 50 * 1000
  },
  {
    size: 8,
    num: 50 * 1000
  },
  {
    size: 9,
    num: 20 * 1000
  },
  {
    size: 10,
    num: 10 * 1000
  },
  {
    size: 11,
    num: 5 * 1000
  },
  {
    size: 12,
    num: 4
  },
  {
    size: 13,
    num: 2
  },
  {
    size: 14,
    num: 2
  },
  {
    size: 15,
    num: 2
  },
  {
    size: 16,
    num: 2
  },
  {
    size: 17,
    num: 2
  },
  {
    size: 18,
    num: 2
  },
  {
    size: 19,
    num: 2
  },
  {
    size: 20,
    num: 2
  }
]


scales.map(item => {
  item.num = item.num * 8;
  return item
});



module.exports = {
  scales,
  screenScales(size) {
    let num = 0
    scales.map(item => {
      if (item.size >= 12) {
        console.log(item)
        item.num = 4 * 1000 * 8
      }
      if (item.size == size) {
        num = item.num
      }
      return item;
    });
    return num
  }
}