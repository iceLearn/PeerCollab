import amber from '@material-ui/core/colors/amber'
import blue from '@material-ui/core/colors/blue'
import blueGrey from '@material-ui/core/colors/blueGrey'
import brown from '@material-ui/core/colors/brown'
import common from '@material-ui/core/colors/common'
import cyan from '@material-ui/core/colors/cyan'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'
import indigo from '@material-ui/core/colors/indigo'
import lightBlue from '@material-ui/core/colors/lightBlue'
import lightGreen from '@material-ui/core/colors/lightGreen'
import lime from '@material-ui/core/colors/lime'
import orange from '@material-ui/core/colors/orange'
import pink from '@material-ui/core/colors/pink'
import purple from '@material-ui/core/colors/purple'
import red from '@material-ui/core/colors/red'
import teal from '@material-ui/core/colors/teal'
import yellow from '@material-ui/core/colors/yellow'

function getColorByName(name) {
  if (name) {
    switch (name.toUpperCase().substring(0, 1)) {
      case 'A': return yellow
      case 'B': return red
      case 'C': return lightGreen
      case 'D': return lightBlue
      case 'E': return orange
      case 'F': return brown
      case 'G': return lime
      case 'H': return pink
      case 'I': return grey
      case 'J': return blueGrey
      case 'K': return brown
      case 'L': return blueGrey
      case 'M': return lightBlue
      case 'N': return cyan
      case 'O': return grey
      case 'P': return purple
      case 'Q': return deepOrange
      case 'R': return blue
      case 'S': return green
      case 'T': return deepPurple
      case 'U': return pink
      case 'V': return teal
      case 'W': return indigo
      case 'X': return brown
      case 'Y': return amber
      case 'Z': return brown
      default: return common
    }
  } else {
    return common
  }
}

export { getColorByName }
