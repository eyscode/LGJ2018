export function centerGameObjects(objects) {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5)
    })
}

export function cartesianToIsometric(cartPt) {
    let tempPt = new Phaser.Point();
    tempPt.x = cartPt.x - cartPt.y;
    tempPt.y = (cartPt.x + cartPt.y) / 2;
    return (tempPt);
}