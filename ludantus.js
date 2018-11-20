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
      return {xv: xv, yv: yv, rects: []};
    }
    let closestHorizRect = null, closestVertRect = null;
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
            changes.horizontal = false;
            changes.squareDist = changes.newyv * changes.newyv;
          } else {
            const slope = yv / xv;
            const anchorx = xv > 0 ? x + width : x;
            const sidex = xv > 0 ? rect.x : rect.x + rect.width;
            const anchory = yv > 0 ? y + height : y;
            const sidey = yv > 0 ? rect.y : rect.y + rect.height;
            let xCollided = false;
            const collisionY = slope * (sidex - anchorx) + y;
            if (collisionY <= rect.y + rect.height && rect.y <= collisionY + height) {
              xCollided = true;
              changes.newxv = sidex - anchorx;
              changes.newyv = collisionY - y;
              changes.squareDist = changes.newxv * changes.newxv + changes.newyv * changes.newyv;
              changes.side = xv > 0 ? 'left' : 'right';
              changes.horizontal = true;
            }
            const collisionX = (sidey - anchory) / slope + x;
            if (collisionX <= rect.x + rect.width && rect.x <= collisionX + width) {
              const newxv = collisionX - x, newyv = sidey - anchory;
              const squareDist = newxv * newxv + newyv * newyv;
              if (!xCollided || squareDist < changes.squareDist) {
                changes.newxv = newxv;
                changes.newyv = newyv;
                changes.squareDist = squareDist;
                changes.side = yv > 0 ? 'top' : 'bottom';
                changes.horizontal = false;
              }
            }
          }
          if (changes.side) {
            if (changes.horizontal) {
              if (!closestHorizRect || closestHorizRect.squareDist > changes.squareDist)
                closestHorizRect = changes;
            } else {
              if (!closestVertRect || closestVertRect.squareDist > changes.squareDist)
                closestVertRect = changes;
            }
          }
        }
      }
    });
    if (closestHorizRect || closestVertRect) {
      const obj = {
        xv: xv, yv: yv,
        rects: []
      };
      if (closestHorizRect) {
        obj.xv = closestHorizRect.newxv;
        obj[closestHorizRect.side] = true;
        obj.rects.push(closestHorizRect.rect);
      }
      if (closestVertRect) {
        obj.yv = closestVertRect.newyv;
        obj[closestVertRect.side] = true;
        obj.rects.push(closestVertRect.rect);
      }
      return obj;
    }
    else return {xv: xv, yv: yv, rects: []};
  }

}
