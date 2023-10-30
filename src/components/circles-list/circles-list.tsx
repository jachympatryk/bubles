import React from 'react'
import { CirclesListProps } from './circles-list.types'
import styles from './circle-list.module.scss'
export const CirclesList: React.FC<CirclesListProps> = ({
  circles,
  handleRemoveCircle,
  centerMapOnCircle,
}) => {
  return (
    <ul className={styles.infoList}>
      {circles.map((circle, index) => (
        <li key={index} onClick={() => centerMapOnCircle(circle)}>
          <p>
            Latitude:
            {circle.lat}
          </p>
          <p>
            Longitude:
            {circle.lng}
          </p>
          <p>
            Radius:
            {circle.radius / 1000} km
          </p>
          <p>
            GMV:
            {circle.gmv}
          </p>
          <button
            onClick={e => {
              e.stopPropagation()
              handleRemoveCircle(index)
            }}
          >
            Usuń
          </button>
        </li>
      ))}
    </ul>
  )
}
