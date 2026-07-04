interface Props {
  onClose: () => void
}

export function HowToPlay({ onClose }: Props) {
  return (
    <div className="howto-overlay" onClick={onClose}>
      <div className="howto-modal" onClick={e => e.stopPropagation()}>
        <h2 className="howto-title">Kuidas mängida?</h2>
        <p className="howto-tagline">Sinu ülesanne: selgita välja <strong>Kes</strong> oli juhtumiga seotud, <strong>Kus</strong> see toimus ja <strong>Milline ese</strong> oli oluline.</p>

        <ol className="howto-steps">
          <li>
            <span className="howto-step-icon">🃏</span>
            <div>
              <strong>Mängu algus</strong>
              <p>Süsteem valib salaja lahenduse (1 tegelane + 1 asukoht + 1 ese) ja jagab ülejäänud kaardid mängijatele. Sinu käes olevad kaardid <em>ei ole</em> lahendus.</p>
            </div>
          </li>
          <li>
            <span className="howto-step-icon">🏛️</span>
            <div>
              <strong>Vali ruum oma korda alustades</strong>
              <p>Iga kord algab ruumi valikuga. See on ruum mida sa "külastad" — hüpotees esitatakse sellest ruumist.</p>
            </div>
          </li>
          <li>
            <span className="howto-step-icon">🔍</span>
            <div>
              <strong>Esita hüpotees</strong>
              <p>Vali kahtlusalune tegelane ja tõend/ese. Järgmine mängija, kellel on mõni nimetatud kaart, näitab sulle seda <em>salaja</em>. Tõmba see oma märkmikus maha — see kaart <em>ei ole</em> lahendus.</p>
            </div>
          </li>
          <li>
            <span className="howto-step-icon">📓</span>
            <div>
              <strong>Tee märkmeid</strong>
              <p>Kasuta detektiivimärkmikku. Märgi kaardid mida oled näinud <strong>✗ välistatuks</strong>. Kaardid mida pole näidatud — <strong>✓ võimalikuks</strong> või <strong>? teadmatuks</strong>.</p>
            </div>
          </li>
          <li>
            <span className="howto-step-icon">⚖️</span>
            <div>
              <strong>Tee lõplik süüdistus — aga ainult siis, kui oled KINDEL</strong>
              <p>Süüdistus on lõplik. Kui kõik kolm (tegelane + asukoht + ese) on õiged — <strong>võidad</strong>! Kui eksid — langed mängust välja ja teised jätkavad.</p>
            </div>
          </li>
        </ol>

        <button className="btn-primary howto-close" onClick={onClose}>
          Sain aru — alustame!
        </button>
      </div>
    </div>
  )
}
