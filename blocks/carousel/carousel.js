export default function decorate(block) {
  const container = block.querySelector('div');
  container.style.display = 'flex';
  container.style.overflowX = 'auto';
  container.style.scrollBehavior = 'smooth';
}
