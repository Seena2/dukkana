'use Client'
import {motion} from 'framer-motion';
import styles from './paymentCard.module.scss'
function PaymentCard({method, selectedMethod,onSelect, icon, title,description,children}:
  {method:string; selectedMethod:string; onSelect:(method:string)=>void; icon:React.ReactNode;title:string;description?:string;
    children?:React.ReactNode;
  }) {
   const isSelected=selectedMethod === method; 
  return (
    <div className={`styles.paymentCard ${isSelected ? styles.selected:""}`} onClick={()=>onSelect(method)}>
      <div className={styles.cardHeader}>
        <div className={styles.radioButton}>
          {isSelected && <div className={styles.selecteRadioOption}></div>}
        </div>
        <div className={styles.cardIcon}>{icon}</div>
        <div className={styles.cardDescription}>
          <h4 className={styles.title}>{title}</h4>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {method==="stripe" && <div className={styles.cardLogo}>
          <div className={styles.visa}></div>
          <div className={styles.mastercard}></div>
          <div className={styles.amex}></div>
            </div>}
        </div>
        {isSelected && children &&
        <motion.div  initial ={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}transition={{duration:0.3}} className={styles.cardDetails}>
          {children}
          </motion.div>}
      </div>
  )
}

export default PaymentCard
