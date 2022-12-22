const displayChoroplethMap = async () => {
  try {
    // Fetch data
    let [kickStarterPledgesData, movieSalesData, videoGamesSalesData] =
      await Promise.all([
        fetch(
          'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
        ),
        fetch(
          'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
        ),
        fetch(
          'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
        ),
      ]);
    kickStarterPledgesData = await kickStarterPledgesData.json();
    movieSalesData = await movieSalesData.json();
    videoGamesSalesData = await videoGamesSalesData.json();

    console.log({ kickStarterPledgesData });
    console.log({ movieSalesData });
    console.log({ videoGamesSalesData });

    hideLoader();
  } catch (error) {
    console.log(error);
  }
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChoroplethMap();
