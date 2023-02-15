export class Provincia {
  id?:Number;
  provincia?:String;
}

export class Canton {
  id?:Number;
  canton?:String;
  idProvincia?:Number;
}

export class Parroquia {
  id?:Number;
  parroquia?:String;
  idCanton?:Number;
}

export class Barrio {
  id:Number
  barrio:String
}
