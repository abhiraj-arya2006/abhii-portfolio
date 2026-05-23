import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="education">
      <div className="career-container">
        <h2>
          My <span>Education</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science (AI-ML)</h4>
                <h5>Bharati Vidyapeeth’s College of Engineering, New Delhi</h5>
              </div>
              <h3>2024-28</h3>
            </div>
            <p>
              Pursuing a Bachelor of Technology degree in Computer Science with
              a specialization in Artificial Intelligence and Machine Learning.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Higher Secondary (Class XII)</h4>
                <h5>Sam International School, New Delhi · CBSE</h5>
              </div>
              <h3>2023-24</h3>
            </div>
            <p>
              Completed higher secondary education with a science background,
              achieving an overall score of 85%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Secondary (Class X)</h4>
                <h5>Sam International School, New Delhi · CBSE</h5>
              </div>
              <h3>2021-22</h3>
            </div>
            <p>
              Completed secondary education, building a strong academic
              foundation and achieving an outstanding score of 95.8%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
