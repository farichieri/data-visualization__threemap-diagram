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

    // Fetch data
    const matchingData =
      path === URL.HOME
        ? MATCHING_DATA.VIDEOGAMES
        : path === URL.MOVIES
        ? MATCHING_DATA.MOVIES
        : path === URL.KICKSTARTER
        ? MATCHING_DATA.KICKSTARTER
        : MATCHING_DATA.VIDEOGAMES;

    const pathUrl = matchingData.URL;
    const dataTitle = matchingData.TITLE;
    const dataDescription = matchingData.SUBTITLE;

    let response = await fetch(
      `https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/${pathUrl}.json`
    );
    const data = await response.json();
    console.log({ data });

    // Constants
    const width = 600;
    const height = 250;
    const padding = 65;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3
      .select('.container')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    // Create SVG
    const svg = d3
      .select('.container')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Add Title
    document.getElementById('title').innerHTML = dataTitle;

    // Add description
    document.getElementById('description').innerHTML = dataDescription;

    // Create treemap
    const treemap = d3
      .treemap()
      .size([width - padding, height])
      .padding(0.5);
    const root = d3.hierarchy(data).sum((d) => d.value);
    treemap(root);

    const cell = svg
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

    const tile = cell
      .append('rect')
      .attr('class', 'tile')
      .attr('data-name', (d) => d.data.name)
      .attr('data-category', (d) => d.data.category)
      .attr('data-value', (d) => d.data.value)
      .attr('data-category', (d) => d.data.category)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => color(d.data.category))
      .on('mouseover', function (d, item) {
        const { name, category, value } = item.data;
        d3.select(this)
          .transition()
          .duration('50')
          .attr('opacity', '.50')
          .attr('stroke', 'black')
          .attr('stroke-width', '0.9');
        tooltip.transition().duration(100).style('opacity', 1);
        tooltip
          .html(
            `
            <div>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Value:</strong> ${value}</p>
            </div>
      `
          )
          .style('left', d.pageX - 50 + 'px')
          .style('top', d.pageY - 50 + 'px')
          .attr('data-value', value);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration('50')
          .attr('opacity', '1')
          .attr('stroke', 'none');
        tooltip.transition().duration(100).style('opacity', 0);
      });

    cell
      .append('text')
      .selectAll('tspan')
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append('tspan')
      .attr('style', 'font-size: 4px')
      .attr('x', 2)
      .attr('y', (d, i) => 4 + i * 5)
      .text((d) => d);

    const legendWIth = width / 4;
    const legendHeight = 20;
    const blockSize = 10;

    const categories = root
      .leaves()
      .map((leave) => leave.data.category)
      .filter((item, idx, arr) => arr.indexOf(item) === idx);

    svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - padding}, ${padding / 4})`)
      .append('g')
      .attr('width', legendWIth)
      .attr('height', legendHeight);

    svg
      .select('#legend')
      .append('g')
      .attr('id', 'colors')
      .selectAll('rect')
      .data(categories)
      .enter()
      .append('rect')
      .attr('class', 'legend-item')
      .attr('x', blockSize / 2)
      .attr('y', (d, i) => i * (blockSize + 1) + 10)
      .attr('width', blockSize)
      .attr('height', blockSize)
      .attr('fill', (d) => color(d))
      .attr('stroke', 'black')
      .attr('stroke-width', '.2');

    svg
      .append('g')
      .selectAll('text')
      .data(categories)
      .enter()
      .append('text')
      .attr('transform', `translate(${width - padding}, ${padding / 4})`)
      .attr('fill', 'black')
      .attr('x', blockSize * 2)
      .attr('y', (d, i) => i * (blockSize + 1) + 17)
      .text((d) => d)
      .style('font-size', 5);

    hideLoader();
  } catch (error) {
    console.log(error);
  }
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayThreeMapDiagram();
