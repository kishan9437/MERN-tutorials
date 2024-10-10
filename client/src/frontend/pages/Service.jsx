import { useAuth } from "../../contexts/AuthContext.jsx"

export default function Service() {
  const { services } = useAuth();
  return (
    <>
      <section className="section-services">
        <div className="container">
          <h1 className="main-heading" style={{paddingLeft:'5rem'}}>Services</h1>
        </div>

        <div className="container grid grid-three-cols">
          {
            services.map((curElem, index) => {
              const { price, description, provider, service } = curElem;

              return (<div className="card" key={index}>
                <div className="card-img">
                  <img src="/assets/images/design.png" alt="services" width='200' />
                </div>

                <div className="card-details">
                  <div className="grid grid-two-cols">
                    <p>{provider}</p>
                    <p>{price}</p>
                  </div>
                  <h2>{service}</h2>
                  <p>{description}</p>
                </div>
              </div>
              );
            })
          }

        </div>
      </section>
    </>
  )
}
