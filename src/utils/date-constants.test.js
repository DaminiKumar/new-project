const MOCK_DATE = new Date("2025-09-19T10:00:00.000Z");
jest.useFakeTimers().setSystemTime(MOCK_DATE);

describe("date-constants", () => {
  let dateConstants;

  beforeAll(() => {
    jest.isolateModules(() => {
      dateConstants = require("./date-constants");
    });
  });

  // 3. Clean up the mocks
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should correctly set the "today" constant', () => {
    // Access the imported constant from the loaded module
    expect(dateConstants.today).toEqual(MOCK_DATE);
  });

  it('should correctly set the "threeMonthsAgo" constant', () => {
    const expectedDate = new Date(MOCK_DATE);
    expectedDate.setMonth(expectedDate.getMonth() - 3);

    // Access the imported constant from the loaded module
    expect(dateConstants.threeMonthsAgo).toEqual(expectedDate);
  });
});
