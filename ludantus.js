class Player {

  constructor() {
    //
  }

  compDist(dx, dy, comparedDist) {
    const sum = dx * dx + dy * dy;
    const square = comparedDist * comparedDist;
    return sum === square ? 0 : sum < square ? -1 : 1;
  }

  checkCollisions(playerData, rectangles) {
    const {x, y, width, height, xv, yv} = playerData;
    if (xv === 0 && yv === 0) {
      return {xv: xv, yv: yv, rect: null, side: null};
    }
    let closestRectangle = null;
    rectangles.forEach(rect => {
      if (rect.x < x + width + xv && x + xv < rect.x + rect.width
          && rect.y < y + height + yv && y + yv < rect.y + rect.height) {
        if (rect.type === 'solid') {
          const changes = {
            rect: rect,
            newxv: xv, newyv: yv
          };
          if (xv === 0) {
            if (yv > 0) {
              changes.newyv = rect.y - y - height;
              changes.side = 'top';
            } else {
              changes.newyv = rect.y + width - y;
              changes.side = 'bottom';
            }
            changes.squareDist = changes.newyv * changes.newyv;
          } else {
            const slope = yv / xv;
            const anchorx = xv > 0 ? x + width : x;
            const sidex = xv > 0 ? rect.x : rect.x + rect.width;
            const anchory = yv > 0 ? y + height : y;
            const sidey = yv > 0 ? rect.y : rect.y + rect.height;
            let xCollided = false;
            const collisionY = slope * (sidex - anchorx) + anchory;
            if (collisionY >= rect.y && collisionY <= rect.y + rect.height) {
              xCollided = true;
              changes.newxv = sidex - anchorx;
              changes.newyv = collisionY - anchory;
              changes.squareDist = changes.newxv * changes.newxv + changes.newyv * changes.newyv;
              changes.side = xv > 0 ? 'left' : 'right';
            }
            const collisionX = (sidey - anchory) / slope + anchorx;
            if (collisionX >= rect.x && collisionX <= rect.x + rect.width) {
              const newxv = collisionX - anchorx, newyv = sidey - anchory;
              const squareDist = newxv * newxv + newyv * newyv;
              if (xCollided) {
                if (squareDist < changes.squareDist) {
                  changes.newxv = newxv;
                  changes.newyv = newyv;
                  changes.squareDist = squareDist;
                  changes.side = yv > 0 ? 'top' : 'bottom';
                }
              } else {
                changes.newxv = newxv;
                changes.newyv = newyv;
                changes.squareDist = squareDist;
                changes.side = yv > 0 ? 'top' : 'bottom';
              }
            }
          }
          if (changes.side && (!closestRectangle || closestRectangle.squareDist > changes.squareDist))
            closestRectangle = changes;
        }
      }
    });
    if (closestRectangle) return {
      xv: closestRectangle.newxv,
      yv: closestRectangle.newyv,
      rect: closestRectangle.rect,
      side: closestRectangle.side
    };
    else return {xv: xv, yv: yv, rect: null, side: null};
  }

}
