/**
 * Geometry shared by the transformation reveals (floors, grid, louvres).
 *
 * A stage is cut into cells, each with its own progress from 0 (the before
 * photograph shows) to 1 (the after photograph shows). The after photograph
 * is clipped to the union of the cells as one clip-path polygon, so each
 * photograph is in the page once, however many cells there are.
 *
 * The union is traced rectangle by rectangle, all clockwise, and each one is
 * reached from and returned to the stage's top-left corner. Those connecting
 * runs go out and back along the same line, so they enclose no area and
 * never show.
 */

export interface Cell {
  /** Left, top, width and height, in percent of the stage. */
  x: number
  y: number
  w: number
  h: number
  /** 0 hidden, 1 fully open. */
  p: number
  /** This cell's own way of opening, when it differs from the stage's. */
  grow?: Grow
}

/** How a cell opens: from its centre, from its vertical centre line, upward from its floor, or across from its left or right edge. */
export type Grow = 'center' | 'x' | 'up' | 'left' | 'right'

export function gridCells(cols: number, rows: number, p = 1): Cell[] {
  const cells: Cell[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: (c / cols) * 100, y: (r / rows) * 100, w: 100 / cols, h: 100 / rows, p })
    }
  }
  return cells
}

const f = (n: number) => `${Math.round(n * 1000) / 1000}%`

export function clipFor(cells: Cell[], grow: Grow): string {
  let all = true
  const pts: string[] = []
  for (const c of cells) {
    if (c.p < 0.999) all = false
    if (c.p <= 0.001) continue
    let x0 = c.x
    let y0 = c.y
    let x1 = c.x + c.w
    let y1 = c.y + c.h
    const g = c.grow ?? grow
    if (g === 'up') {
      y0 = y1 - c.h * c.p
    } else if (g === 'left') {
      x1 = x0 + c.w * c.p
    } else if (g === 'right') {
      x0 = x1 - c.w * c.p
    } else if (g === 'x') {
      const half = (c.w * c.p) / 2
      x0 = c.x + c.w / 2 - half
      x1 = c.x + c.w / 2 + half
    } else {
      const hw = (c.w * c.p) / 2
      const hh = (c.h * c.p) / 2
      x0 = c.x + c.w / 2 - hw
      x1 = c.x + c.w / 2 + hw
      y0 = c.y + c.h / 2 - hh
      y1 = c.y + c.h / 2 + hh
    }
    pts.push('0 0', `${f(x0)} ${f(y0)}`, `${f(x1)} ${f(y0)}`, `${f(x1)} ${f(y1)}`, `${f(x0)} ${f(y1)}`, `${f(x0)} ${f(y0)}`)
  }
  // Fully open: no clip at all, so finished seams can never hairline.
  if (all) return 'none'
  if (!pts.length) return 'inset(0 0 100% 0)'
  return `polygon(${pts.join(', ')}, 0 0)`
}
