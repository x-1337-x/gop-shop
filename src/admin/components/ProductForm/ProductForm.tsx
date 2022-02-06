import { Category, Prisma } from '@prisma/client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Form, Row, InputGroup, Button } from 'react-bootstrap';
import { CategoriesOptions } from '../CategoryOptions';
import { getCategoriesTree } from '../../api/categories';

type ProductFormProps = {
  data: Partial<Prisma.ProductUncheckedCreateInput>;
  onSubmit(values: Prisma.ProductUncheckedCreateInput): unknown;
};

export const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { data, onSubmit } = props;
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategoriesTree().then((data) => {
      setCategories(data);
    });
  }, []);

  const formik = useFormik<Prisma.ProductUncheckedCreateInput>({
    enableReinitialize: true,
    initialValues: {
      name: '',
      price: 0,
      categoryId: undefined,
      description: '',
      isAvailable: true,
      isActive: true,
      isFeatured: false,
      ...data,
      saleValue: data.saleValue ? data.saleValue : 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required().positive(),
      saleValue: Yup.number().required().integer().min(0),
    }),
    onSubmit: async (values) => {
      values.price = Number(values.price);
      values.saleValue = Number(values.saleValue);

      if (values.categoryId) {
        values.categoryId = Number(values.categoryId);
      } else {
        values.categoryId = null;
      }
      const result = await onSubmit(values);

      console.log(result);
    },
  });

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="name">
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              size="lg"
              type="text"
              placeholder=""
              required
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={!!(formik.touched.name && formik.errors.name)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="price">
            Price
          </Form.Label>
          <Col sm={3}>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder=""
                required
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                isInvalid={!!(formik.touched.price && formik.errors.price)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.price}
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="saleValue">
            Sale
          </Form.Label>
          <Col sm={3}>
            <InputGroup>
              <InputGroup.Text>%</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder=""
                required
                id="saleValue"
                name="saleValue"
                value={formik.values.saleValue || 0}
                onChange={formik.handleChange}
                isInvalid={
                  !!(formik.touched.saleValue && formik.errors.saleValue)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.saleValue}
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="name">
            Description
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              type="text"
              placeholder=""
              id="description"
              name="description"
              value={formik.values.description || undefined}
              onChange={formik.handleChange}
              isInvalid={
                !!(formik.touched.description && formik.errors.description)
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2} htmlFor="categoryId">
            Category
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              aria-label="Select Category"
              id="categoryId"
              name="categoryId"
              onChange={formik.handleChange}
              value={formik.values.categoryId || undefined}
            >
              <option value={''}>No category</option>
              <CategoriesOptions items={categories} />
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" style={{ alignItems: 'center' }}>
          <Form.Label column sm={2} htmlFor="isActive">
            Active
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              id="isActive"
              name="isActive"
              type="switch"
              checked={formik.values.isActive}
              onChange={formik.handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" style={{ alignItems: 'center' }}>
          <Form.Label column sm={2} htmlFor="isAvailable">
            Available
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              id="isAvailable"
              name="isAvailable"
              type="switch"
              checked={formik.values.isAvailable}
              onChange={formik.handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" style={{ alignItems: 'center' }}>
          <Form.Label column sm={2} htmlFor="isFeatured">
            Featured
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              id="isFeatured"
              name="isFeatured"
              type="switch"
              checked={formik.values.isFeatured}
              onChange={formik.handleChange}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" size="lg">
          Submit
        </Button>
      </Form>
    </>
  );
};
