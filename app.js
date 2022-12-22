const displayThreeMapDiagram = async () => {
  // Add eventHandler and routing selecting fetch data
  const clickHandler = (url) => {
    location.href = `?${url}`;
  };

  const linksArray = document.querySelectorAll('.links ul li a');
  linksArray.forEach((link) =>
    link.addEventListener('click', () => clickHandler(link.className))
  );

  try {
    const path = window.location.search.slice(1);

    const URL = {
      HOME: '/',
      VIDEOGAMES: 'videogames',
      MOVIES: 'movies',
      KICKSTARTER: 'kickstarter',
    };

    const MATCHING_DATA = {
      VIDEOGAMES: {
        SLUG: 'videogames',
        URL: 'video-game-sales-data',
        TITLE: 'Video Game Sales',
        SUBTITLE: 'Top 100 Most Sold Video Games Grouped by Platform',
      },
      MOVIES: {
        SLUG: 'movies',
        URL: 'movie-data',
        TITLE: 'Movie Sales',
        SUBTITLE: 'Top 100 Highest Grossing Movies Grouped By Genre',
      },
      KICKSTARTER: {
        SLUG: 'kickstarter',
        URL: 'kickstarter-funding-data',
        TITLE: 'Kickstarter Pledges',
        SUBTITLE:
          'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
      },
    };

    console.log({ path });

    // Fetch data
    const matchingData =
      path === URL.HOME
        ? MATCHING_DATA.VIDEOGAMES
        : path === URL.MOVIES
        ? MATCHING_DATA.MOVIES
        : path === URL.KICKSTARTER
        ? MATCHING_DATA.KICKSTARTER
        : MATCHING_DATA.VIDEOGAMES;

    console.log({ matchingData });
    const pathUrl = matchingData.URL;
    const title = matchingData.TITLE;
    const description = matchingData.SUBTITLE;

    let response = await fetch(
      `https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/${pathUrl}.json`
    );
    const data = await response.json();
    console.log({ data });

    // Constants
    const width = 550;
    const height = 400;
    const padding = 50;

    // Create SVG
    const svg = d3
      .select('.container')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Add Title
    svg
      .append('text')
      .attr('id', 'title')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.2rem')
      .style('font-weight', 'bold')
      .text(title);

    // Add description
    svg
      .append('text')
      .attr('id', 'description')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '1rem')
      .text(description);

    // Add Axis
    // const xScale = d3.scaleLinear().domain().range();
    // const yScale = d3.scaleLinear().domain().range();

    hideLoader();
  } catch (error) {
    console.log(error);
  }
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayThreeMapDiagram();
